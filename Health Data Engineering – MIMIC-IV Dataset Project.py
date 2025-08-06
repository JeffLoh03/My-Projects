# Databricks notebook source
#admissions.csv 
#load the path
RAW_PATH = "/Volumes/workspace/default/volume/admissions.csv"

df = (spark.read
        #set the first line is header
        .option("header", True)
        #scan the file and guess data types 
        .option("inferSchema", True)
        .csv(RAW_PATH))

display(df)                                      

(df.write
   #Chooses the Delta Lake storage format
   .format("delta")            
   .mode("overwrite")          
   .saveAsTable("admissions_csv"))
#Count the number of instance
spark.sql("SELECT COUNT(*) AS rows FROM admissions_csv").show()


# COMMAND ----------

# patients.csv
RAW_PATH = "/Volumes/workspace/default/volume/patients.csv"

df = (spark.read
        .option("header", True)
        .option("inferSchema", True)
        .csv(RAW_PATH))

display(df)

(df.write
   .format("delta")
   .mode("overwrite")
   .saveAsTable("patients_csv"))

spark.sql("SELECT COUNT(*) AS rows FROM patients_csv").show()


# COMMAND ----------

#transfers.csv
RAW_PATH = "/Volumes/workspace/default/volume/transfers.csv"

df = (spark.read
        .option("header", True)
        .option("inferSchema", True)
        .csv(RAW_PATH))

display(df)

(df.write
   .format("delta")
   .mode("overwrite")
   .saveAsTable("transfers_csv"))

spark.sql("SELECT COUNT(*) AS rows FROM transfers_csv").show()


# COMMAND ----------

#omr.csv
RAW_PATH = "/Volumes/workspace/default/volume/omr.csv"

df = (spark.read
        .option("header", True)
        .option("inferSchema", True)
        .csv(RAW_PATH))

display(df)

(df.write
   .format("delta")
   .mode("overwrite")
   .saveAsTable("omr_csv"))

spark.sql("SELECT COUNT(*) AS rows FROM omr_csv").show()


# COMMAND ----------

# MAGIC %md
# MAGIC Data Preprocessing

# COMMAND ----------


from pyspark.sql.functions import (
    col, when, lit, lead, regexp_replace, expr,
    coalesce, abs, avg, stddev, to_timestamp
)
from pyspark.sql.types import TimestampType
from pyspark.sql import Window
#a defensive timestamp–parsing helper
def safe_ts(name: str):
    s = col(name).cast("string")
    is_digits = s.rlike("^[0-9]+$")          
    epoch_ms  = (s.cast("bigint") / 1000).cast(TimestampType())
    return when(is_digits, epoch_ms).otherwise(to_timestamp(col(name)))
#use unknown instead of null for missing values
def fill_unknown(df, cols):
    for c in cols:
        df = df.withColumn(c, coalesce(col(c), lit("UNKNOWN")))
    return df


ad_raw = spark.table("admissions_csv")
adm_clean = (ad_raw
    #Keep only useful columns & cast timestamps
    .select("subject_id", "hadm_id", "admittime", "dischtime")
    .withColumn("admittime_ts", safe_ts("admittime"))
    .withColumn("dischtime_ts", safe_ts("dischtime"))
    ##Keeps rows whose admit time parsed successfully and whose discharge time is either missing or chronologically after the admit time.
    .filter(col("admittime_ts").isNotNull())
    .filter((col("dischtime_ts").isNull()) | (col("dischtime_ts") >= col("admittime_ts")))
)

print(f"Admissions kept : {adm_clean.count():,}  /  {ad_raw.count():,}")
display(adm_clean.limit(5))


tr_raw = spark.table("transfers_csv")
w_tr    = Window.partitionBy("hadm_id").orderBy("intime")

tr_clean = (tr_raw
    #Keep the necessary column 
    .select("subject_id", "hadm_id", "intime", "outtime", "careunit")
    .withColumn("intime_ts",  safe_ts("intime"))
    .withColumn("outtime_ts", safe_ts("outtime"))
    .withColumn("next_intime", lead("intime_ts").over(w_tr))
    .withColumn(
        "end_ts",
        when(col("outtime_ts").isNotNull(), col("outtime_ts"))
        .when(col("next_intime").isNotNull(), col("next_intime"))
        .otherwise(col("intime_ts"))
    )
    #Drop rows missing an intime and end is before start
    .filter(col("intime_ts").isNotNull())
    .filter(col("end_ts") >= col("intime_ts"))
)

tr_clean = (
    fill_unknown(tr_clean, ["careunit"])            # NULL → "UNKNOWN"
    .filter(col("careunit") != "UNKNOWN")           # drop the UNKNOWN rows
    .select("subject_id", "hadm_id", "intime_ts", "end_ts", "careunit")
)

print(f"Transfers kept  : {tr_clean.count():,}  /  {tr_raw.count():,}")
display(tr_clean.limit(5))


# COMMAND ----------

# MAGIC %md
# MAGIC Weekend vs Weekday Admission Volumes

# COMMAND ----------

from pyspark.sql.functions import dayofweek, when, count, round, col

# Step 1: Add day-of-week index to each admission (subject_id + day_index)
subject_day_df = adm_clean.select(
    "subject_id",
    dayofweek("admittime_ts").alias("day_index")
)

display(subject_day_df)

# Step 2: Add is_weekend flag for weekend/weekday classification
adm_with_flags = adm_clean.withColumn("day_index", dayofweek("admittime_ts")) \
                          .withColumn("is_weekend", when(col("day_index").isin(1, 7), 1).otherwise(0))

# Step 3: Original summary output (unchanged)
week_summary = (adm_with_flags
    .agg(
        count("*").alias("total"),
        count(when(col("is_weekend") == 1, True)).alias("weekend"),
        count(when(col("is_weekend") == 0, True)).alias("weekday")
    )
    .withColumn("pct_weekend", round(col("weekend") / col("total"), 4))
    .withColumn("pct_weekday", round(col("weekday") / col("total"), 4))
)

display(week_summary)


# COMMAND ----------

# MAGIC %md
# MAGIC Readmission Rate Within 30 Days
# MAGIC

# COMMAND ----------

from pyspark.sql import Window
from pyspark.sql.functions import lead, datediff, when, count, round, col

# Define window
w = Window.partitionBy("subject_id").orderBy("admittime_ts")

# Compute gap days and readmission flag
reads = (adm_clean
    .withColumn("next_admit", lead("admittime_ts").over(w))
    .withColumn("gap_days", datediff("next_admit", "dischtime_ts"))
    .withColumn("readmit_30", when((col("gap_days") >= 0) & (col("gap_days") <= 30), 1).otherwise(0))
    .filter(col("next_admit").isNotNull())  # Keep only valid next admissions
)

#Show the readmit detail
readmit_detail = reads.select("subject_id", "gap_days", "readmit_30")
display(readmit_detail)

#Summary statistics
summary = (reads
    .agg(
        count("*").alias("Total Number of Admission"),
        count(when(col("readmit_30") == 1, True)).alias("Total Number of Readmission"))
    .withColumn("Percentage of Readmission", round(col("Total Number of Readmission") / col("Total Number of Admission"), 4))
)

display(summary)


# COMMAND ----------

# MAGIC %md
# MAGIC **_Maps reduce_** 
# MAGIC
# MAGIC **ICU Re-Entry Within Same Admission**
# MAGIC

# COMMAND ----------

# MAGIC %md
# MAGIC **Mapping Stage**

# COMMAND ----------


display(tr_clean.limit(5))                


# COMMAND ----------

from pyspark.sql.functions import struct, collect_list, array_sort

kv_df = (tr_clean
           .groupBy("subject_id", "hadm_id")
           .agg(array_sort(collect_list(struct("intime_ts", "careunit")))
                .alias("value"))
           .select(struct("subject_id", "hadm_id").alias("key"), "value"))

display(kv_df.limit(10))


# COMMAND ----------

from pyspark.sql import Window
from pyspark.sql.functions import col, when, lag, sum as _sum

ICU_PATTERN = "(?i)(ICU|Intensive Care Unit|CCU)"
w = Window.partitionBy("subject_id", "hadm_id").orderBy("intime_ts")

mapped_df = (tr_clean
    .withColumn("is_icu", col("careunit").rlike(ICU_PATTERN).cast("int"))
    .withColumn("lag_is_icu", lag("is_icu").over(w))
    .withColumn("cum_prev_icu",
                _sum("is_icu").over(w.rowsBetween(Window.unboundedPreceding, -1)))
    .withColumn(
        "reentry_row",
        when(
            (col("is_icu") == 1) &                         # now in ICU
            ((col("lag_is_icu") == 0) | col("lag_is_icu").isNull()) &
            (col("cum_prev_icu") > 0),                     # had ICU before
            1
        ).otherwise(0))
)

display(mapped_df.limit(10))


# COMMAND ----------

# MAGIC %md
# MAGIC Shuffle Stage

# COMMAND ----------

from pyspark.sql.functions import array_sort, collect_list, struct

shuffled_preview = (mapped_df
    .repartition("subject_id", "hadm_id")        
    .groupBy("subject_id", "hadm_id")
    .agg(array_sort(collect_list(struct("intime_ts", "careunit")))
         .alias("moves")))

display(shuffled_preview.limit(10))


# COMMAND ----------

# MAGIC %md
# MAGIC Reduce Stage

# COMMAND ----------

from pyspark.sql.functions import max as _max

reduce_flag_df = (mapped_df
    .groupBy("subject_id", "hadm_id")
    .agg(_max("reentry_row").alias("icu_reentry")))

display(reduce_flag_df.limit(150))


# COMMAND ----------

# MAGIC %md
# MAGIC Final

# COMMAND ----------

icu_reentry_df = reduce_flag_df.filter("icu_reentry = 1").drop("icu_reentry")
display(icu_reentry_df.limit(20))


# COMMAND ----------

total_admissions   = reduce_flag_df.count()
icu_reentry_count  = icu_reentry_df.count()
reentry_rate       = icu_reentry_count / total_admissions if total_admissions else 0

print(f"  Total admissions:             {total_admissions:,}")
print(f"  Admissions with ICU re‑entry: {icu_reentry_count:,}")
print(f"  ICU re‑entry rate:            {reentry_rate:.2%}")

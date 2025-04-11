# Vincent Lay Kai Yi Student A 00000043696
# Jeff Loh Wei Kit Student B 00000043357
# main menu
def main():
    while True:
        print("1.Manage Patients' Info and Status\n2.Manage Hospital Rooms Info and status")
        print("3.Manage Physicians' Info and Status\n4.Manage Hospital Transaction Records")
        print("Q.Quit")
        # ask user to input 
        choice=input("Enter Your Choice: ").upper()
        
        if choice=='1':
            while True:
                print("1. Add patient's name and status\n2. Update patient's status")
                print("3. Remove patient\n4. Display all patients and status\n5. Return to main menu")
                option = input("Which option would you like to select?: ")
 
                if option == '1':
                    add_patient(patient_list, combined_list, patient_ids)
 
                elif option == '2':
                    patient_id = input("Enter the patient's ID you want to update: ")
                    update_patient_info_by_id(patient_id, patient_list)
 
                elif option == '3':
                    patient_id = input("Enter the patient's ID to remove: ")
                    remove_patient(patient_id, patient_list)
                    remove_from_combined_list(patient_id, patient_list, combined_list, patient_ids)
                elif option == '4':
                    display_all_patients(patient_list)
 
                elif option == '5':
                    break
 
                else:
                    print("Undefined choice, please enter again.\n")
        elif choice=='2':
            while True:
                print("1. Add patient to ward\n2. Remove patient from ward")
                print("3. Display all ward information\n4. Display patient list in ward\n5. Display patient list in ICU ward")
                print("6. Display patient list in AC ward\n7. Return to main menu")
                selection = input("Which option would you like to select?: ")
                if selection == '1':
                    add_patient_to_ward(ward_list, patient_list, combined_list, icu_list, ac_list)
                elif selection == '2':
                    remove_patient_from_ward_by_id(ward_list, icu_list, ac_list)
                elif selection == '3':
                    display_all_ward_information(ward_list, icu_list, ac_list)
                elif selection == '4':
                    display_patient_list_in_ward(ward_list)
                elif selection == '5':
                    display_patient_list_in_icu(icu_list)
                elif selection == '6':
                    display_patient_list_in_ac(ac_list)
                elif selection == '7':
                    break
                else:
                    print("Undefined choice, please enter again.\n")
        elif choice=='3':
            while True:
                print("Manage Physcisions' Info and Status\n1.Add physcisions\n2.Update current physicion")
                print("3.Remove current physicions by its position\n4.Remove current physicion by its name\n5.Display current physicians\n6.Return to main menu")
                choose=input("Enter Your Choice: ")
                
                if choose=='1' :
                    add_physicians()
                elif choose=='2':
                    update_physicians()
                elif choose=='3':
                    remove_physicians()
                elif choose=='4':
                    remove_physicians_value()
                elif choose=='5':
                    display_physicians()
                elif choose=='6':
                    break
                else:
                   print("Undefind choice, please enter again\n")
                   
        elif choice=='4':
            while True:
                print("Manage Hospital Transaction Records\n1.Add services for current patient\n2.Search bill for patient\n3.Return to main menu")
                choose=input("Enter Your Choice:")
                
                if choose=='1' : 
                    service_add()
                elif choose=='2':
                    search_billing_details()  
                elif choose=='3':
                    break
                else:
                    print("Undefind choice, please enter again\n")
        elif choice=='Q':
            break
        else:
            print("Undefind choice, please enter again\n")
physician_list=[]
specialisation_list=['General practitioner','Internal medicine','Family medicine','Pediatrician','Ophthalmology'
                     ,'Surgeon','Psychiatrist','Dermatologist Pediatrics','Anesthesiologist','Neurologist','Urologist'
                     ,'Urology','Radiologist','Oncologist','Cardiologist','Obstetrics and gynaecology','Orthopaedist','Dermatology'
                     ,'Gastroenterologist','Neurology','Cardiology','Orthopedics','Emergency medicine']
service_list=[{"Services":"consultation","cost":100},{"Services":"Ward","cost":250},{"Services":"Operation","cost":300}
              ,{"Services":"CT simulation","cost":450},{"Services":"Radiotherapy treatment","cost":100},{"Services":"X-Ray","cost":70}
              ,{"Services":"Blood test","cost":60},{"Services":"Urine test","cost":60},{"Services":"Hepatitis B vaccine","cost":150}
              ,{"Services":"PCR Covid test","cost":270},{"Services":"Covid-19 vaccine","cost":100}]
combined_list = []
patient_list = []
patient_ids = []
ward_list = [{'ward_number': i, 'patient_id': '', 'patient_name': '', 'patient_status': 'vacant'} for i in range(1, 101)]
icu_list = [{'icu_number': i, 'patient_id': '', 'patient_name': '', 'patient_status': 'vacant'} for i in range(1, 101)]
ac_list = [{'ac_number': i, 'patient_id': '', 'patient_name': '', 'patient_status': 'vacant'} for i in range(1, 51)]
transaction_record=[]
billing_details=[]
def add_patient(patient_list, combined_list, patient_ids):
    code = int(input("Enter the patient's user ID: "))
 
    # Check if the patient ID already exists
    if any(patient['Code'] == code for patient in patient_list):
        print("Patient with the same ID already exists. Please choose a different ID.")
        return
    else:
        name = str(input("Enter a patient's name: ")).upper()
        gender = str(input("Enter the patient's gender: "))
        age = int(input("Enter the patient's age: "))
        status = str(input("Enter the patient's status: "))
        patient_list.append({"Code": code, "Name": name, "Gender": gender, "Age": age, "Status": status})
        combined_list.append({"Code": code, "Name": name, "Gender": gender, "Age": age, "Status": status})
        patient_ids.append(code)  # Update patient_ids list
        print("Patient added successfully.")

def update_patient_info_by_id(patient_id, patient_list):
    patient = find_patient_by_id(int(patient_id), patient_list)
 
    if patient:
        print("Current Information for Patient {}:".format(patient_id))
        print("Name: {}".format(patient['Name']))
        print("Gender: {}".format(patient['Gender']))
        print("Age: {}".format(patient['Age']))
        print("Status: {}".format(patient['Status']))
 
        patient['Name'] = input("Enter the new name (press Enter to keep current): ") or patient['Name']
        patient['Gender'] = input("Enter the new gender (press Enter to keep current): ") or patient['Gender']
        patient['Age'] = input("Enter the new age (press Enter to keep current): ") or patient['Age']
        patient['Status'] = input("Enter the new status (press Enter to keep current): ") or patient['Status']
 
        print("Patient {}'s information updated successfully.".format(patient_id))
    else:
        print("Patient with ID {} not found.".format(patient_id))
 
def find_patient_by_id(patient_id, patient_list):
    for patient in patient_list:
        if patient['Code'] == patient_id:
            return patient
    return None
 
def remove_patient(patient_id, patient_list):
    # Convert patient_id to integer for comparison
    patient_id = int(patient_id)
    # Initialize an empty list to store patients that match the condition
    patients_to_remove = []
    # Iterate through each patient in patient_list
    for patient in patient_list:
        # Check if the 'Code' attribute of the current patient is equal to the provided patient_id
        if patient['Code'] == patient_id:
            # If the condition is True, add the patient to the patients_to_remove list
            patients_to_remove.append(patient)
 
    if patients_to_remove:
        for patient in patients_to_remove:
            patient_list.remove(patient)
            print("Patient with ID", patient_id, "removed successfully.")
    else:
        print("Patient with ID", patient_id, "not found.")
 
def remove_from_combined_list(patient_id, patient_list, combined_list, patient_ids):
    combined_list = []
 
    # Remove the patient from the combined_list
    combined_list = [patient for patient in combined_list if patient['Code'] != patient_id]
 
    # Call your other functions to remove the patient from patient_list and patient_ids
    remove_patient(patient_id, patient_list)
    remove_patient_from_patient_ids(patient_id, patient_ids)
def remove_patient_from_patient_ids(patient_id, patient_ids):
    # Check if the patient_id exists in patient_ids before removing
    if patient_id in patient_ids:
        patient_ids.remove(patient_id)
        print("Patient with ID", patient_id, "removed from patient_ids successfully.")
    else:
        print("Patient with ID", patient_id, "not found in patient_ids.")
 
def display_all_patients(patient_list):
    print("\nPatients and Status:")
    for patient in patient_list:
        print("User ID:", patient['Code'], "Name:", patient['Name'], ", Gender:", patient['Gender'], ", Age:", patient['Age'], ", Status:", patient['Status'])
 
def update_combined_list(patient_name, new_status):
    global combined_list  # Remove this line
    for item in combined_list:
        if item['Name'] == patient_name:
            item['Status'] = new_status
            return
def is_patient_in_ward(patient_name):
    global ward_list
    for ward in ward_list:
        if ward['patient_name'] == patient_name:
            return True
    return False
 
def add_patient_to_ward(hospital_ward, patient_detail, combine_list, icu_list, ac_list):
    patient_id = input("Enter the patient's ID to add to the ward: ")
 
    # Check if the patient ID exists
    selected_patient = next((patient for patient in patient_detail if str(patient.get("Code")) == patient_id), None)
 
    if not selected_patient:
        print("Patient with ID {} not found.".format(patient_id))
        return
 
    # Check if the patient is already in any ward
    if any(ward.get('patient_id') == selected_patient.get("Code") for ward in hospital_ward + icu_list + ac_list):
        print("This patient is already in a ward.")
        return
 
    ward_type = input("Please key in which ward type (Ward/ICU/AC): ").upper()
    ward_number = input("Please key in which ward number: ")
 
    selected_ward = {}  # Initialize selected_ward as an empty dictionary
 
    # Find the selected ward based on type and number
    if ward_type == 'WARD':
        selected_ward = next((ward for ward in hospital_ward if ward.get('ward_number') == int(ward_number)), {})
    elif ward_type == 'ICU':
        selected_ward = next((ward for ward in icu_list if ward.get('icu_number') == int(ward_number)), {})
    elif ward_type == 'AC':
        selected_ward = next((ward for ward in ac_list if ward.get('ac_number') == int(ward_number)), {})
 
    if not selected_ward:
        print("Selected ward not found.")
        return
 
    # Check if the patient is already in the ward
    if selected_ward.get('patient_id') == selected_patient.get("Code"):
        print("This patient already in this ward.")
        return
 
    # Add the patient to the selected ward
    selected_ward['patient_id'] = selected_patient.get("Code")
 
    # Assuming you have a combine_list to store combined ward and patient details
    combine_list.append({'ward': selected_ward, 'patient': selected_patient})
 
    print("Patient ID is added successfully to ward {} of {} ward.".format(selected_ward.get('ward_number', ''), ward_type))
 
    # Change the status of the ward number to 'Occupied', others remain 'Vacant'
    for ward in hospital_ward + icu_list + ac_list:
        if ward_type == 'WARD' and ward.get('ward_number') == int(ward_number):
            ward['ward_status'] = 'Occupied'
        elif ward_type == 'ICU' and ward.get('icu_number') == int(ward_number):
            ward['ward_status'] = 'Occupied'
        elif ward_type == 'AC' and ward.get('ac_number') == int(ward_number):
            ward['ward_status'] = 'Occupied'
        else:
            ward['ward_status'] = 'Vacant'
 
def display_all_ward_information(hospital_ward, icu_list, ac_list):
    print("\nWard Information:")
    all_wards = hospital_ward + icu_list + ac_list
 
    # Print information only for wards with patient ID
    for ward in all_wards:
        if ward.get("patient_id"):
            # Determine the ward type and number based on the list the ward belongs to
            ward_type = "WARD" if ward in hospital_ward else ("ICU" if ward in icu_list else "AC")
            ward_number = ward.get("ward_number", "") if ward_type == "WARD" else ward.get(f"{ward_type.lower()}_number", "")
            ward_status = "Occupied" if ward["patient_id"] else "Vacant"
            print("Ward Type: {}, Ward Number: {}, Patient ID: {}, Status: {}".format(
                ward_type, ward_number, ward.get("patient_id", ""), ward_status))
 
def is_ward_number_occupied(ward_type, ward_number, all_wards):
    for ward in all_wards:
        if ward.get('Ward Type', '').upper() == ward_type and ward.get('Ward Number') == ward_number:
            return True
    return False
 
def remove_patient_from_ward_by_id(ward_list, icu_list, ac_list):
    patient_id = input("Enter the patient's ID to remove from the ward: ")
 
    # Check in the WARD list
    for ward in ward_list:
        if ward.get('patient_id') == int(patient_id):
            remove_patient_from_ward(int(patient_id), ward_list)
            print("Patient {} removed from WARD {} successfully.".format(patient_id, ward['ward_number']))
            return
 
    # Check in the ICU list
    for ward in icu_list:
        if ward.get('patient_id') == int(patient_id):
            remove_patient_from_ward(int(patient_id), icu_list)
            print("Patient {} removed from ICU {} successfully.".format(patient_id, ward['icu_number']))
            return
 
    # Check in the AC list
    for ward in ac_list:
        if ward.get('patient_id') == int(patient_id):
            remove_patient_from_ward(int(patient_id), ac_list)
            print("Patient {} removed from AC {} successfully.".format(patient_id, ward['ac_number']))
            return
 
    print("Patient with ID {} not found in any ward.".format(patient_id))
 
def remove_patient_from_ward(patient_id, ward_list):
    # Find the ward in the list
    selected_ward = next((ward for ward in ward_list if ward.get('patient_id') == int(patient_id)), None)
 
    if selected_ward:
        # Update the ward status to 'Vacant'
        selected_ward['patient_id'] = ""
        selected_ward['patient_status'] = 'vacant'
    else:
        print("Patient with ID {} not found in the ward list.".format(patient_id))
def display_patient_list_in_ward(hospital_ward):
    print("\nPatients in Ward:")
    for ward in hospital_ward:
        if ward['patient_id'] != "":
            print("Ward Number: {}, Patient ID: {}, Ward Status: {}".format(
                ward['ward_number'], ward['patient_id'], 'Occupied' if ward['patient_id'] else 'Vacant'))
 
def display_patient_list_in_icu(icu_list):
    print("\nPatients in ICU:")
    for ward in icu_list:
        if ward['patient_id'] != "":
            print("ICU Number: {}, Patient ID: {}, Ward Status: {}".format(ward['icu_number'], ward['patient_id'], 'Occupied' if ward['patient_id'] else 'Vacant'))
 
def display_patient_list_in_ac(ac_list):
    print("\nPatients in AC:")
    for ward in ac_list:
        if ward['patient_id'] != "":
            print("AC Number: {}, Patient ID: {}, Ward Status: {}".format(ward['ac_number'], ward['patient_id'], 'Occupied' if ward['patient_id'] else 'Vacant'))

#function for option 1(main menu option 3)
def add_physicians():
    # list the specialisatio list to let the user choose
    total=0
    for specialist in specialisation_list:
        total+=1
        print(total,'.',specialist)
        
    specialisation=int(input("Enter the specialization:"))
    # checking the input 
    while int(specialisation) > len(specialisation_list):
        print("Invalid ")
        specialisation=eval(input("Enter the specialization again:"))
        
    # ask user to input data
    name=str(input("Enter physician's name:")).upper()
    # append into the dictionary then append into list
    physician = {'name': name, 'specialisation': specialisation_list[specialisation-1]}
    physician_list.append(physician)
    print("{} specialise in {} is added\n".format(name,specialisation_list[specialisation-1]))

#function for option 2 (main option 3)
def update_physicians():
    total=0
    count=0
    # display the position of physician to update
    for physician in physician_list:
        total+=1 
        print(total,'.',physician)
    index = int(input("Enter physician index to update: "))
   
    #update info 
    if index-1 < len(physician_list):
           name = input("Enter physician name: ").upper()
           # the specialist list with index
           for specialist in specialisation_list:
               count+=1
               print(count,'.',specialist)
           specialisation=int(input("Enter the specialization:"))
           physician_list[index-1] = {'name': name, 'specialisation': specialisation_list[specialisation-1]}
           print("Physician {} updated successfully.\n".format(name))
    else:
           print("Invalid physician index.\n")
           
# function for option 3 (main option 3)
def remove_physicians():
    # show no physician 
   if len(physician_list)==0:
       print("The current number of physician is 0")
   elif len(physician_list)>0:
       print(physician_list) 
       remove=int(input("Enter a physicians' position to remove: "))
       # check the validity
       while (remove-1) > len(physician_list):
            print("Undefind position\n")
            remove=int(input("Enter the position again:")) 
       if remove-1 <= len(physician_list):
            del physician_list[remove-1]
            print("Remove successfully\n")      

#function for option 4(main option 3)
def remove_physicians_value():
    # show 0 physicians
    if len(physician_list)==0:
        print("The current number of physician is 0\n")
    elif len(physician_list)>0:
        print(physician_list)
        physician_name=input("Enter physician's name to delete:").upper()
    for physician in physician_list:
        while True:   
            # if the user input is inside the list then proceed 
            if physician["name"] == physician_name :
                physician_list.remove(physician)
                print("The physician {} is remove, the current list:{}\n".format(physician_name,physician_list))
                break
            elif physician["name"]!=physician_name:
                physician_name=input("Invalid, please enter again:").upper()

#function for option 5 (main option 4)
def display_physicians():
    # if the list has nothing, show the number=0
    if len(physician_list)==0:
        print("The current number of physician is 0")
    # display the list
    elif len(physician_list)>0:
        for physician in physician_list :
            print("THE current physicians:{}\n".format(physician))
            
# function for option 1 (main option 4)
def service_add():
# using library function to automatic fill in the today date
# source by https://www.w3schools.com/python/python_datetime.asp
    from datetime import datetime
    # initiate the variable
    total=0
    # list down the service list one by one 
    for service in service_list:
        total+=1
        print(total,'.',service)  
    patient_addservice=input("Enter patient's name:").upper()
    while True:
        # using for loop to check the patient name inside the dictionary one by one
        for patient in patient_list:
            # check the validity
            if patient.get ("Name") != patient_addservice:
                patient_addservice=input("Invalid,Enter patient's name again:").upper()
            # check is it inside the list
            elif patient.get("Name")==patient_addservice:
                # initialize the variable
                total_cost = 0
                while True:
                    service_index = input("Enter the index of the service to add the cost (enter 'stop' to finish): ")
                    # when stop then break
                    if service_index.lower() == 'stop':
                        print("Total Cost for {}: RM{}".format(patient_addservice,total_cost))
                        return False
                    # use try to avoid error appear 
                    try:
                        service_index = int(service_index)
                        if 1 <= service_index <= len(service_list):
                            selected_service = service_list[service_index - 1]
                            cost = selected_service['cost']
                            # today date will key in automatic
                            date =datetime.now().date()
                            total_cost += cost
                            billing_details.append({'Patient': patient_addservice, 'Service': selected_service['Services'], 'Cost': cost, 'Date': date})
                            print("Added billing detail for service '{}' with cost {} on {}\n".format(selected_service['Services'],cost,date))
                        else:
                            print("Invalid. Please enter a valid number\n.")
                    except ValueError:
                        print("Invalid. Please enter a number\n.")
                        
# function for option 2 (main function 4)
def search_billing_details():
    search_patient = input("Enter the patient's name to search for billing details: ").upper()
    details_found=[]
    # check the Patient s it inside the patient list by using for loop 
    for detail in billing_details:
        if detail['Patient']==search_patient:
            details_found.append(detail)
    print("\nSearch Results for {}:".format(search_patient))
    # calculate the total amount
    if details_found:
        total_cost=0
        for detail in details_found:
            print(detail)
            # using .get() to abstract the cost only inside the dictionary 
            total_cost+=detail.get('Cost')
        print("Total Cost for {}: RM{}\n".format(search_patient,total_cost))
    else:
        print("No billing details found for {}.\n".format(search_patient))

main()



            
                
            
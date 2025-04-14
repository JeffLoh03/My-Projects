
// ---------- Login ----------
const loginForm = document.getElementById('login-form');
if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('token', data.token);
        alert('Login successful!');
        window.location.href = 'main.html';
      } else {
        alert(data.msg || 'Login failed');
      }
    } catch (error) {
      console.error('Login Error:', error);
      alert('Login failed due to an error.');
    }
  });
}

// ---------- Post Management ----------
document.addEventListener('DOMContentLoaded', function() {
    // Initialize post filters
    const filterButtons = document.querySelectorAll('.filter-btn');
    if (filterButtons) {
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                filterButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                const filter = this.getAttribute('data-filter');
                filterPosts(filter);
            });
        });
    }

    // Initialize modal functionality
    const modal = document.getElementById('post-form-container');
    const addPostBtn = document.getElementById('add-post-btn');
    const fabButton = document.querySelector('.fab-button');
    const closeBtn = document.querySelector('.close-btn');

    function openModal() {
        if (modal) modal.style.display = 'block';
    }

    function closeModal() {
        if (modal) modal.style.display = 'none';
    }

    if (addPostBtn) addPostBtn.addEventListener('click', openModal);
    if (fabButton) fabButton.addEventListener('click', openModal);
    if (closeBtn) closeBtn.addEventListener('click', closeModal);

    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    // Initialize image preview
    const imageInput = document.getElementById('post-image');
    const imagePreview = document.getElementById('image-preview');

    if (imageInput && imagePreview) {
        imageInput.addEventListener('change', function() {
            const file = this.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    imagePreview.innerHTML = `
                        <div class="preview-container">
                            <img src="${e.target.result}" alt="Preview">
                            <button type="button" class="remove-image">×</button>
                        </div>
                    `;

                    // Add remove image functionality
                    const removeBtn = imagePreview.querySelector('.remove-image');
                    removeBtn.addEventListener('click', function() {
                        imageInput.value = '';
                        imagePreview.innerHTML = '';
                    });
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // Initialize tag selection
    const tags = document.querySelectorAll('.tag');
    if (tags) {
        tags.forEach(tag => {
            tag.addEventListener('click', function() {
                this.classList.toggle('selected');
            });
        });
    }

    // Post submission
const postForm = document.getElementById('post-form');
if (postForm) {
  postForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
                alert('Please log in to create a post');
                window.location.href = 'login.html';
      return;
    }

    const title = document.getElementById('post-title').value;
    const content = document.getElementById('post-content').value;
            const selectedTags = Array.from(document.querySelectorAll('.tag.selected'))
                .map(tag => tag.textContent);

            let image = '';
            const imageInput = document.getElementById('post-image');
            if (imageInput && imageInput.files[0]) {
                image = await convertToBase64(imageInput.files[0]);
    }

    try {
      const response = await fetch('http://localhost:5000/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        title,
                        content,
                        image,
                        tags: selectedTags
                    })
                });

      if (response.ok) {
                    const newPost = await response.json();
                    closeModal();
                    postForm.reset();
                    if (imagePreview) imagePreview.innerHTML = '';
                    document.querySelectorAll('.tag.selected')
                        .forEach(tag => tag.classList.remove('selected'));
                    
                    // Refresh posts
                    loadPosts();
                    
                    // Show success message
                    showNotification('Post created successfully!', 'success');
                } else {
                    const error = await response.json();
                    showNotification(error.message || 'Failed to create post', 'error');
                }
            } catch (error) {
                console.error('Create Post Error:', error);
                showNotification('An error occurred while creating the post', 'error');
            }
        });
    }

    // Load initial posts
    if (window.location.pathname.endsWith('main.html')) {
        loadPosts();
    }
});

// ---------- Post Display and Management ----------
async function loadPosts() {
    try {
        const response = await fetch('http://localhost:5000/api/posts');
        const posts = await response.json();
        displayPosts(posts);
    } catch (error) {
        console.error('Load Posts Error:', error);
        showNotification('Error loading posts', 'error');
    }
}

function displayPosts(posts) {
    const postFeed = document.getElementById('post-feed');
    if (!postFeed) return;

    const postsHTML = posts.map(post => {
        const authorName = post.authorId?.name || 'Anonymous';
        const dateString = new Date(post.createdAt).toLocaleString();
        const imageHTML = post.image ? `<img src="${post.image}" alt="Post Image" class="post-image">` : '';
        const tags = post.tags ? post.tags.map(tag => `<span class="tag">${tag}</span>`).join('') : '';
        
        return `
            <div class="post-card animate-on-scroll" data-categories="${post.categories || ''}">
                <div class="post-header">
                    <div class="author-info">
                        <i class="fas fa-user-circle"></i>
                        <span>${authorName}</span>
                    </div>
                    <div class="post-date">
                        <i class="fas fa-clock"></i>
                        <span>${dateString}</span>
                    </div>
                </div>
                <h3>${post.title}</h3>
                ${imageHTML}
                <p>${post.content}</p>
                <div class="post-footer">
                    <div class="tag-container">
                        ${tags}
                    </div>
                    <div class="post-actions">
                        <button class="btn-fancy like-btn" data-post-id="${post._id}">
                            <i class="fas fa-heart"></i>
                            <span>Like</span>
                        </button>
                        <button class="btn-fancy comment-btn" data-post-id="${post._id}">
                            <i class="fas fa-comment"></i>
                            <span>Comment</span>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');

    postFeed.innerHTML = postsHTML;

    // Initialize post animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));
}

// Filter posts by category
function filterPosts(category) {
    const posts = document.querySelectorAll('.post-card');
    posts.forEach(post => {
        if (category === 'all' || post.dataset.categories.includes(category)) {
            post.style.display = 'block';
        } else {
            post.style.display = 'none';
    }
  });
}

// ---------- Utility Functions ----------
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}

async function convertToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

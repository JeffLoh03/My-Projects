document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.getElementById('registerForm');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const passwordRequirements = document.createElement('div');
    passwordRequirements.className = 'password-requirements';
    
    // Insert password requirements after password input
    passwordInput.parentNode.insertBefore(passwordRequirements, passwordInput.nextSibling);

    // Password requirements list
    const requirements = [
        { regex: /.{8,}/, text: "At least 8 characters long" },
        { regex: /[A-Z]/, text: "Contains uppercase letter" },
        { regex: /[a-z]/, text: "Contains lowercase letter" },
        { regex: /[0-9]/, text: "Contains number" },
        { regex: /[^A-Za-z0-9]/, text: "Contains special character" }
    ];

    // Create requirement elements
    requirements.forEach(requirement => {
        const element = document.createElement('div');
        element.className = 'requirement';
        element.innerHTML = `
            <span class="icon">❌</span>
            <span class="text">${requirement.text}</span>
        `;
        passwordRequirements.appendChild(element);
    });

    // Password validation function
    function validatePassword() {
        const password = passwordInput.value;
        let valid = true;

        requirements.forEach((requirement, index) => {
            const isValid = requirement.regex.test(password);
            const requirementElement = passwordRequirements.children[index];
            requirementElement.querySelector('.icon').textContent = isValid ? '✅' : '❌';
            requirementElement.classList.toggle('valid', isValid);
            valid = valid && isValid;
        });

        return valid;
    }

    // Confirm password validation
    function validateConfirmPassword() {
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;
        const matchMessage = document.getElementById('passwordMatch') || document.createElement('div');
        
        if (!document.getElementById('passwordMatch')) {
            matchMessage.id = 'passwordMatch';
            confirmPasswordInput.parentNode.insertBefore(matchMessage, confirmPasswordInput.nextSibling);
        }

        if (confirmPassword === '') {
            matchMessage.textContent = '';
            return false;
        } else if (password === confirmPassword) {
            matchMessage.textContent = '✅ Passwords match';
            matchMessage.style.color = 'green';
            return true;
        } else {
            matchMessage.textContent = '❌ Passwords do not match';
            matchMessage.style.color = 'red';
            return false;
        }
    }

    // Add event listeners
    passwordInput.addEventListener('input', validatePassword);
    confirmPasswordInput.addEventListener('input', validateConfirmPassword);

    // Form submission
    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const isPasswordValid = validatePassword();
        const isConfirmPasswordValid = validateConfirmPassword();

        if (!isPasswordValid || !isConfirmPasswordValid) {
            alert('Please ensure all password requirements are met and passwords match.');
            return;
        }

        // If validation passes, proceed with registration
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            password: passwordInput.value
        };

        console.log('Form Data:', formData);

        // Send registration request to backend
        fetch('http://localhost:5000/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Registration successful! Please login.');
                window.location.href = 'login.html';
            } else {
                alert(data.message || 'Registration failed. Please try again.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Registration failed. Please check the console for details and ensure the server is running.');
        });
    });
});
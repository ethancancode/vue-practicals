<template>
  <div class="prac-four-body">
    
    <!-- Top Header section with toggle button -->
    <div class="header-section">
      <h2>{{ showSubmissions ? 'Submitted Applications' : 'Job Application Form' }}</h2>
      <!-- <button class="btn-toggle-view" @click="toggleView">
        {{ showSubmissions ? '← Back to Form' : 'View Submissions' }}
      </button> -->
    </div>

    <!-- 1. Dedicated Submissions View (Toggled Page) -->
    <div v-if="showSubmissions" class="submissions-page-container">
      <p v-if="submissions.length === 0" class="no-submissions">
        No job applications have landed in the database yet.
      </p>
      
      <div v-else class="submissions-list">
        <div v-for="app in submissions" :key="app._id" class="sub-card">
          <div class="sub-header">
            <h4>{{ app.personal.name }}</h4>
            <span class="sub-date">
              {{ new Date(app.submittedAt).toLocaleString() }}
            </span>
          </div>
          <p>
            <strong>Email:</strong> {{ app.personal.email }} | 
            <strong>Phone:</strong> {{ app.personal.phone }}
          </p>
          <p>
            <strong>Education:</strong> {{ app.education.degree }} at 
            {{ app.education.institution }} ({{ app.education.passingYear }})
          </p>
          
          <div v-if="app.experience && app.experience.length > 0" class="sub-experience">
            <strong>Experience:</strong>
            <ul>
              <li v-for="(exp, i) in app.experience" :key="i">
                {{ exp.role }} at {{ exp.company }} 
                ({{ exp.startDate || 'N/A' }} to {{ exp.endDate || 'Present' }})
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- 2. Multi-step Form Wizard View -->
    <div v-else class="wizard-container">
      <!-- Simple Progress Indicator -->
      <div class="progress-bar-text">
        <strong>Step {{ currentStep }} of 4:</strong> 
        <span v-if="currentStep === 1">Personal Details</span>
        <span v-else-if="currentStep === 2">Education Details</span>
        <span v-else-if="currentStep === 3">Work Experience Details</span>
        <span v-else-if="currentStep === 4">Review & Submit</span>
      </div>

      <!-- Main Form Card -->
      <div class="card">
        <!-- Step 1: Personal Details -->
        <div v-if="currentStep === 1">
          <h3>Step 1: Personal Details</h3>
          
          <div class="form-group">
            <label for="p-name">Full Name *</label>
            <input 
              id="p-name"
              type="text" 
              v-model.trim="formData.personal.name" 
              placeholder="Enter your full name" 
            />
          </div>

          <div class="form-group">
            <label for="p-email">Email Address *</label>
            <input 
              id="p-email"
              type="email" 
              v-model.trim="formData.personal.email" 
              placeholder="example@domain.com" 
            />
          </div>

          <div class="form-group">
            <label for="p-phone">Phone Number (10 digits) *</label>
            <input 
              id="p-phone"
              type="text" 
              v-model.trim="formData.personal.phone" 
              placeholder="e.g., 9876543210" 
              maxlength="10" 
            />
          </div>

          <div class="form-group">
            <label for="p-dob">Date of Birth (Must be 18 or older) *</label>
            <input 
              id="p-dob"
              type="date" 
              v-model="formData.personal.dob" 
            />
          </div>
        </div>

        <!-- Step 2: Education -->
        <div v-if="currentStep === 2">
          <h3>Step 2: Education Details</h3>
          
          <div class="form-group">
            <label for="e-degree">Degree *</label>
            <input 
              id="e-degree"
              type="text" 
              v-model.trim="formData.education.degree" 
              placeholder="e.g., B.Sc. Computer Science" 
            />
          </div>

          <div class="form-group">
            <label for="e-inst">Institution / University *</label>
            <input 
              id="e-inst"
              type="text" 
              v-model.trim="formData.education.institution" 
              placeholder="e.g., St. Xavier's College" 
            />
          </div>

          <div class="form-group">
            <label for="e-year">Year of Passing *</label>
            <input 
              id="e-year"
              type="number" 
              v-model.number="formData.education.passingYear" 
              placeholder="e.g., 2024" 
            />
          </div>
        </div>

        <!-- Step 3: Work Experience -->
        <div v-if="currentStep === 3">
          <div class="section-header">
            <h3>Step 3: Work Experience <small>(Optional)</small></h3>
            <button class="btn-add" id="add-exp-btn" @click="store.addWorkExperience">
              + Add Work Experience
            </button>
          </div>
          
          <p v-if="formData.experience.length === 0" class="no-experience">
            No work experience added. You can skip this step or click "+ Add Work Experience".
          </p>

          <div 
            v-for="(exp, index) in formData.experience" 
            :key="index" 
            class="experience-card"
          >
            <div class="exp-header">
              <h4>Job Entry #{{ index + 1 }}</h4>
              <button 
                class="btn-remove" 
                :id="'remove-exp-' + index"
                @click="store.removeWorkExperience(index)"
              >
                Remove
              </button>
            </div>

            <div class="grid-2">
              <div class="form-group">
                <label :for="'exp-company-' + index">Company Name *</label>
                <input 
                  :id="'exp-company-' + index"
                  type="text" 
                  v-model.trim="exp.company" 
                  placeholder="e.g., Microsoft" 
                />
              </div>
              <div class="form-group">
                <label :for="'exp-role-' + index">Role / Designation *</label>
                <input 
                  :id="'exp-role-' + index"
                  type="text" 
                  v-model.trim="exp.role" 
                  placeholder="e.g., Frontend Developer" 
                />
              </div>
            </div>

            <div class="grid-2">
              <div class="form-group">
                <label :for="'exp-start-' + index">Start Date</label>
                <input 
                  :id="'exp-start-' + index"
                  type="date" 
                  v-model="exp.startDate" 
                />
              </div>
              <div class="form-group">
                <label :for="'exp-end-' + index">End Date</label>
                <input 
                  :id="'exp-end-' + index"
                  type="date" 
                  v-model="exp.endDate" 
                />
              </div>
            </div>
            
            <p 
              v-if="exp.startDate && exp.endDate && new Date(exp.endDate) <= new Date(exp.startDate)" 
              class="error-text"
            >
              ⚠️ End Date must be after Start Date.
            </p>
          </div>
        </div>

        <!-- Step 4: Review & Submit -->
        <div v-if="currentStep === 4">
          <h3>Step 4: Review & Submit Details</h3>
          
          <div class="summary-section">
            <h4>Personal Details</h4>
            <p><strong>Name:</strong> {{ formData.personal.name }}</p>
            <p><strong>Email:</strong> {{ formData.personal.email }}</p>
            <p><strong>Phone:</strong> {{ formData.personal.phone }}</p>
            <p><strong>Date of Birth:</strong> {{ formData.personal.dob }}</p>
          </div>

          <div class="summary-section">
            <h4>Education</h4>
            <p><strong>Degree:</strong> {{ formData.education.degree }}</p>
            <p><strong>Institution:</strong> {{ formData.education.institution }}</p>
            <p><strong>Year of Passing:</strong> {{ formData.education.passingYear }}</p>
          </div>

          <div class="summary-section">
            <h4>Work Experience</h4>
            <p v-if="formData.experience.length === 0">No experience details added.</p>
            <table v-else class="exp-table">
              <thead>
                <tr>
                  <th>Company</th>
                  <th>Role</th>
                  <th>Timeline</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(exp, index) in formData.experience" :key="index">
                  <td>{{ exp.company }}</td>
                  <td>{{ exp.role }}</td>
                  <td>
                    <span v-if="exp.startDate || exp.endDate">
                      {{ exp.startDate || 'N/A' }} to {{ exp.endDate || 'Present' }}
                    </span>
                    <span v-else>N/A</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- wizard action buttons -->
        <div class="navigation-buttons">
          <button 
            v-if="currentStep > 1" 
            class="btn-back" 
            id="wizard-back-btn"
            @click="currentStep--"
          >
            Back
          </button>
          
          <div class="flex-spacer"></div>

          <button 
            v-if="currentStep < 4" 
            class="btn-next" 
            id="wizard-next-btn"
            :disabled="!isCurrentStepValid" 
            @click="currentStep++"
          >
            Next
          </button>
          
          <button 
            v-else 
            class="btn-submit" 
            id="wizard-submit-btn"
            @click="submit"
          >
            Submit Application
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useApplicationStore } from './store/applicationStore';
import './style.css';

const store = useApplicationStore();
const { currentStep, formData, submissions } = storeToRefs(store);

const showSubmissions = ref(false);

const toggleView = async () => {
  showSubmissions.value = !showSubmissions.value;
  if (showSubmissions.value) {
    await store.fetchApplications();
  }
};

// Step 1 Validation: Name, Email pattern, 10-digit Phone, Age >= 18
const isStep1Valid = computed(() => {
  const p = formData.value.personal;
  if (!p.name || !p.email || !p.phone || !p.dob) return false;
  
  // Email validator
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(p.email)) return false;

  // Phone validator: exactly 10 digits
  const phonePattern = /^\d{10}$/;
  if (!phonePattern.test(p.phone)) return false;

  // Age validator: Must be >= 18 years old
  const dobDate = new Date(p.dob);
  const today = new Date();
  let age = today.getFullYear() - dobDate.getFullYear();
  const monthDiff = today.getMonth() - dobDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dobDate.getDate())) {
    age--;
  }
  return age >= 18;
});

// Step 2 Validation: Degree, Institution, Passing Year (1800 to current year)
const isStep2Valid = computed(() => {
  const e = formData.value.education;
  if (!e.degree || !e.institution || !e.passingYear) return false;

  const currentYear = new Date().getFullYear();
  const year = parseInt(e.passingYear, 10);
  return !isNaN(year) && year >= 1800 && year <= currentYear;
});

// Step 3 Validation: Company & Role required if entry exists. End Date > Start Date if both set
const isStep3Valid = computed(() => {
  const experienceList = formData.value.experience;
  if (experienceList.length === 0) return true; // Optional overall

  for (const exp of experienceList) {
    if (!exp.company || !exp.role) return false;
    
    if (exp.startDate && exp.endDate) {
      if (new Date(exp.endDate) <= new Date(exp.startDate)) {
        return false;
      }
    }
  }
  return true;
});

// Current step validator
const isCurrentStepValid = computed(() => {
  if (currentStep.value === 1) return isStep1Valid.value;
  if (currentStep.value === 2) return isStep2Valid.value;
  if (currentStep.value === 3) return isStep3Valid.value;
  return true;
});

const submit = async () => {
  try {
    await store.submitApplication();
    alert('Application submitted successfully!');
    // Switch to submissions list view immediately so they see the result!
    showSubmissions.value = true;
    await store.fetchApplications();
  } catch (error) {
    alert('Failed to submit application.');
  }
};
</script>

import { defineStore } from 'pinia';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const useApplicationStore = defineStore('applicationStore', {
  state: () => ({
    currentStep: 1,
    formData: {
      personal: {
        name: '',
        email: '',
        phone: '',
        dob: ''
      },
      education: {
        degree: '',
        institution: '',
        passingYear: ''
      },
      experience: []
    },
    submissions: []
  }),
  actions: {
    addWorkExperience() {
      this.formData.experience.push({
        company: '',
        role: '',
        startDate: '',
        endDate: ''
      });
    },
    removeWorkExperience(index) {
      this.formData.experience.splice(index, 1);
    },
    async fetchApplications() {
      try {
        const response = await axios.get(`${API_URL}/applications`);
        this.submissions = response.data;
      } catch (error) {
        console.error('Error fetching submissions:', error);
      }
    },
    async submitApplication() {
      try {
        await axios.post(`${API_URL}/applications`, this.formData);
        this.resetForm();
        await this.fetchApplications();
        return true;
      } catch (error) {
        console.error('Error submitting application:', error);
        throw error;
      }
    },
    resetForm() {
      this.currentStep = 1;
      this.formData = {
        personal: { name: '', email: '', phone: '', dob: '' },
        education: { degree: '', institution: '', passingYear: '' },
        experience: []
      };
    }
  }
});

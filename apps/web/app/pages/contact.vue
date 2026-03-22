<template>
  <div class="bg-background text-foreground font-sans min-h-screen flex flex-col">
    <NavBar />

    <main class="grow pt-32 pb-16 md:pb-24 px-6 md:px-8 max-w-2xl mx-auto w-full">
      <div class="text-center mb-12">
        <h1 class="text-4xl md:text-5xl font-display font-bold mb-4 tracking-tight">Contact Us</h1>
        <p class="text-lg text-muted-foreground">Have a question or need support? Reach out to our team below.</p>
      </div>
      
      <div class="bg-card border border-border/30 rounded-2xl p-6 sm:p-8 shadow-xl shadow-black/5 relative overflow-hidden">
        <!-- Subtle Glow behind form -->
        <div class="absolute -top-24 -right-24 w-64 h-64 bg-primary/10 rounded-full blur-[80px] pointer-events-none mix-blend-screen opacity-50"></div>
        
        <form @submit.prevent="submitForm" class="space-y-6 relative z-10">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-foreground mb-1.5">First Name</label>
              <Input v-model="form.firstName" placeholder="John" required class="bg-secondary/50 border-border/50 text-foreground h-11 focus-visible:border-primary focus-visible:ring-primary/20" />
            </div>
            <div>
              <label class="block text-sm font-medium text-foreground mb-1.5">Last Name</label>
              <Input v-model="form.lastName" placeholder="Doe" required class="bg-secondary/50 border-border/50 text-foreground h-11 focus-visible:border-primary focus-visible:ring-primary/20" />
            </div>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-foreground mb-1.5">Email Address</label>
            <Input type="email" v-model="form.email" placeholder="john@example.com" required class="bg-secondary/50 border-border/50 text-foreground h-11 focus-visible:border-primary focus-visible:ring-primary/20" />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-foreground mb-1.5">Subject</label>
            <select v-model="form.subject" required class="flex h-11 w-full items-center justify-between whitespace-nowrap rounded-md border px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1 bg-secondary/50 border-border/50 text-foreground focus-visible:border-primary focus-visible:ring-primary/20">
              <option value="" disabled selected class="text-muted-foreground">Select a topic</option>
              <option value="general" class="bg-card text-foreground">General Inquiry</option>
              <option value="support" class="bg-card text-foreground">Technical Support</option>
              <option value="billing" class="bg-card text-foreground">Billing Question</option>
              <option value="expert" class="bg-card text-foreground">Becoming an Expert</option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-foreground mb-1.5">Message</label>
            <textarea 
              v-model="form.message" 
              placeholder="How can we help you?" 
              rows="5" 
              required 
              class="flex min-h-[80px] w-full rounded-md border px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 resize-none bg-secondary/50 border-border/50 text-foreground focus-visible:border-primary focus-visible:ring-primary/20 focus-visible:ring-2" 
            ></textarea>
          </div>
          
          <Button type="submit" class="w-full h-12 shadow-[0_0_20px_rgba(var(--color-primary),0.2)]" size="lg" :disabled="isSubmitting">
            <span v-if="isSubmitting">Sending...</span>
            <span v-else>Send Message</span>
          </Button>
          
          <p v-if="successMsg" class="text-sm text-primary text-center mt-4 font-medium animate-in fade-in slide-in-from-bottom-2">
            Message sent successfully! We'll be in touch soon.
          </p>
        </form>
      </div>
    </main>

    <FooterComponent />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import NavBar from '~/components/landing/NavBar.vue'
import FooterComponent from '~/components/landing/FooterComponent.vue'

useHead({
  title: 'Contact Us | Laxiriir.expert'
})

const form = ref({
  firstName: '',
  lastName: '',
  email: '',
  subject: '',
  message: ''
})

const isSubmitting = ref(false)
const successMsg = ref(false)

const submitForm = async () => {
  isSubmitting.value = true
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000))
  isSubmitting.value = false
  successMsg.value = true
  
  // Reset form
  form.value = {
    firstName: '',
    lastName: '',
    email: '',
    subject: '',
    message: ''
  }
  
  setTimeout(() => {
    successMsg.value = false
  }, 5000)
}
</script>

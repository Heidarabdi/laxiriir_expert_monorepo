<template>
  <div class="bg-background text-foreground font-body selection:bg-primary selection:text-primary-foreground min-h-screen flex flex-col">
    <NavBar />

    <main class="grow pt-32 pb-24 max-w-7xl mx-auto px-8 w-full">
      <ProfileHeader :expert="expertData" />

      <!-- Main Content Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-16">
        <!-- Content Left Column -->
        <div class="lg:col-span-8 space-y-20">
          <ProfileAbout :expert="expertData" />
          <ProfileAvailability />
          <ProfileExperience :experience="expertData.experience" />
          <ProfileReviews :reviews="expertData.reviews" />
        </div>

        <!-- Sidebar Column -->
        <ProfileSidebar :expert="expertData" />
      </div>
    </main>

    <FooterComponent />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import NavBar from '~/components/landing/NavBar.vue'
import FooterComponent from '~/components/landing/FooterComponent.vue'
import ProfileHeader from '~/components/experts/ProfileHeader.vue'
import ProfileAbout from '~/components/experts/ProfileAbout.vue'
import ProfileAvailability from '~/components/experts/ProfileAvailability.vue'
import ProfileExperience from '~/components/experts/ProfileExperience.vue'
import ProfileReviews from '~/components/experts/ProfileReviews.vue'
import ProfileSidebar from '~/components/experts/ProfileSidebar.vue'

definePageMeta({
  layout: false
})

useHead({
  title: 'Dr. Sarah J. | Expert Profile',
})

const expertData = ref({
  id: '1',
  name: 'Dr. Sarah J.',
  title: 'Clinical Psychologist & High-Performance Behavioral Consultant',
  rating: 4.9,
  reviewsCount: 124,
  image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBrncQqpmfSAIN2JcPkGbwb3aHVPBl_IVl3azvwG-27wTXpUPEx3J5ZM_y2IpHlviIsleZW1nJMWphB2uRFVJmVQ_9-jX6WC029c_UYbBBlkgVhQ3BXc6v8PSKm7DaQK99WcUQj7qMGSfJ32KKnsZnf5CKBKiAa26kC_Tt45FX5RcAfEo8HhXjVsw4g0WVLVRzDvyFzOcdhLCH04BQ94oCC1l1ChmcdNbseY_9iDxIj04bP_H5ZsTpUO7rWPdnDBxL8lxIJ7oJRJ50',
  bio: [
    'Specializing in the intersection of cognitive behavioral science and executive performance. Dr. Sarah J. has spent over 15 years dismantling the psychological barriers that prevent high-impact leaders from reaching their absolute peak potential.',
    'Her approach is clinical, data-driven, and ruthlessly efficient. By treating the mind as a high-performance system, she helps clients recalibrate their internal architecture for resilience and clarity.'
  ],
  tags: [
    'Executive Coaching',
    'Cognitive Behavioral Therapy',
    'Burnout Mitigation',
    'Systems Thinking'
  ],
  price: 350,
  languages: ['English', 'German', 'French'],
  responseTime: 'Under 2 hours',
  nextSlot: 'Today at 4:30 PM EST',
  experience: [
    {
      year: '2018 — Present',
      title: 'Lead Performance Consultant',
      company: 'Quantico Systems Intelligence',
      description: 'Designing cognitive endurance frameworks for C-suite executives in high-volatility markets.'
    },
    {
      year: '2012 — 2018',
      title: 'Clinical Psychologist (PhD)',
      company: 'Stanford Institute for Neuro-Studies',
      description: 'Doctoral research focused on neural plastic responses to stress-induced cognitive loads.'
    }
  ],
  reviews: [
    {
      id: 'rev1',
      text: "The frameworks provided were immediate and actionable. Dr. Sarah didn't just listen; she rewired how I process mission-critical decisions.",
      author: 'Marcus V.',
      authorTitle: 'CEO, Nexus Capital'
    },
    {
      id: 'rev2',
      text: "A surgical approach to mental health. If you are looking for soft-touch therapy, look elsewhere. If you want results, she is the only choice.",
      author: 'Elena R.',
      authorTitle: 'Project Director'
    }
  ]
})
</script>

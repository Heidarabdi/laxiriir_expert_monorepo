<template>
  <div class="bg-background text-foreground font-sans min-h-screen flex flex-col">
    <NavBar />

    <main class="grow pt-32 pb-16 md:pb-24 px-6 md:px-8 max-w-4xl mx-auto w-full">
      <div class="text-center mb-16">
        <h1 class="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6 tracking-tight">About Us</h1>
        <p class="text-lg md:text-xl text-muted-foreground">Empowering individuals through expert guidance and specialized knowledge.</p>
      </div>
      
      <div class="prose prose-invert prose-lg max-w-none text-muted-foreground">
        <h2 class="text-foreground font-display">Our Mission</h2>
        <p>At Laxiriir, our mission is to break down the barriers between world-class expertise and those who seek it. We believe that access to specialized knowledge shouldn't be limited by geography or network. By building a platform that seamlessly connects individuals with verified professionals across various disciplines, we're democratizing access to high-level mentorship, consulting, and problem-solving.</p>
        
        <h2 class="text-foreground font-display mt-10">Why We Do It</h2>
        <p>The modern world is complex and rapidly evolving. Navigating it alone is often inefficient and prone to error. Whether you're a startup founder needing strategic advice, a student seeking academic clarity, or an individual looking for personal development, having the right expert leaning in can save years of trial and error. We built this platform because we wanted a place where finding the perfect mind to tackle your specific challenge was as easy as booking a flight.</p>
        
        <h2 class="text-foreground font-display mt-10">Our Standards</h2>
        <p>Not everyone can be a Laxiriir Expert. We strictly vet our professionals based on a combination of real-world impact, academic pedigree, and peer review. Our goal is to ensure that every consultation booked through our platform delivers immediate, actionable value. When you speak to an expert here, you are speaking to someone who has truly mastered their craft.</p>
      </div>
    </main>

    <FooterComponent />
  </div>
</template>

<script setup lang="ts">
import NavBar from '~/components/landing/NavBar.vue'
import FooterComponent from '~/components/landing/FooterComponent.vue'

useHead({
  title: 'About Us | Laxiriir.expert'
})
</script>

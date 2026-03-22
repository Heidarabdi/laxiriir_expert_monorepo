<template>
  <div class="bg-background text-foreground font-sans min-h-screen flex flex-col">
    <NavBar />

    <main class="grow pt-32 pb-16 md:pb-24 px-6 md:px-8 max-w-4xl mx-auto w-full">
      <div class="mb-12">
        <h1 class="text-4xl md:text-5xl font-display font-bold mb-4 tracking-tight">Privacy Policy</h1>
        <p class="text-muted-foreground">Last updated: {{ new Date().toLocaleDateString() }}</p>
      </div>
      
      <div class="prose prose-invert max-w-none text-muted-foreground">
        <p>This Privacy Policy describes Our policies and procedures on the collection, use and disclosure of Your information when You use the Service and tells You about Your privacy rights and how the law protects You.</p>
        
        <h3 class="text-foreground font-display mt-8">Collection of Information</h3>
        <p>We collect several different types of information for various purposes to provide and improve our Service to you. This includes Personal Data (such as email address, name, phone number) and Usage Data (such as IP address, browser type, pages visited).</p>
        
        <h3 class="text-foreground font-display mt-8">Use of Your Personal Data</h3>
        <p>The Company may use Personal Data for the following purposes: to provide and maintain our Service, to manage Your Account, for the performance of a contract, to contact You regarding updates or informative communications, and to provide You with news and general information about other goods, services and events.</p>
        
        <h3 class="text-foreground font-display mt-8">Retention of Your Personal Data</h3>
        <p>The Company will retain Your Personal Data only for as long as is necessary for the purposes set out in this Privacy Policy. We will retain and use Your Personal Data to the extent necessary to comply with our legal obligations, resolve disputes, and enforce our legal agreements and policies.</p>
        
        <h3 class="text-foreground font-display mt-8">Security of Your Personal Data</h3>
        <p>The security of Your Personal Data is important to Us, but remember that no method of transmission over the Internet, or method of electronic storage is 100% secure. While We strive to use commercially acceptable means to protect Your Personal Data, We cannot guarantee its absolute security.</p>
      </div>
    </main>

    <FooterComponent />
  </div>
</template>

<script setup lang="ts">
import NavBar from '~/components/landing/NavBar.vue'
import FooterComponent from '~/components/landing/FooterComponent.vue'

useHead({
  title: 'Privacy Policy | Laxiriir.expert'
})
</script>

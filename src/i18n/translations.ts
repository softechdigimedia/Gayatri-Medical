export const translations = {
  en: {
    nav: {
      brand: 'Gayetri Medical',
      home: 'Home',
      about: 'About',
      services: 'Services',
      availability: 'Doctor Availability',
      locations: 'Locations',
      faq: 'FAQ',
      doctorPanel: 'Doctor Panel',
      management: 'Management',
      bookAppointment: 'Book an appointment',
      bookShort: 'Book',
      toggleMenu: 'Toggle navigation menu',
      closeMenu: 'Close menu',
      openMenu: 'Open menu',
      questionsCall: 'Questions? Call our direct line:',
      langSelect: 'Select language',
    },
    hero: {
      welcome: 'Welcome to Gayetri Medical',
      title: 'Healthcare for the whole family',
      bookAppointment: 'Book an appointment',
      viewServices: 'View services',
      badge: 'Gentle, modern family healthcare & wellness',
      imgAlt: 'Three diverse happy smiling faces showcasing healthy wellness and gentle family healthcare',
    },
    about: {
      tag: 'About',
      statement: 'At Gayetri Medical, your comfort and comprehensive healthcare are our top priorities. We believe clinical visits should be stress-free and focused on your well-being.',
      stat1Number: '15+',
      stat1Label: 'years of experience',
      stat2Number: '20',
      stat2Label: 'specialists',
      stat3Number: '500+',
      stat3Label: 'patients helped',
    },
    team: {
      title: 'Meet our expert team',
      learnMore: 'Learn more',
      viewProfile: 'View profile & specialties',
      bookWith: 'Book with',
      aboutBackground: 'About & Clinical Background',
      specialties: 'Areas of Specialization',
      back: 'Back',
      doctors: [
        {
          id: 'dr-peter-malloy',
          name: 'Dr. Peter Malloy',
          role: 'Lead Prosthodontist & Implantologist',
          experience: '18+ years',
          education: 'Columbia University College of Physicians & Surgeons',
          bio: 'Dr. Peter Malloy specializes in restorative medical care, complex prosthetics, and implant rehabilitation. With over 18 years of clinical leadership, he emphasizes patient comfort, painless techniques, and long-lasting aesthetic results for all generations.',
          specialties: ['Prosthetic Care', 'Implants', 'Full Mouth Rehabilitation', 'Family Healthcare'],
        },
        {
          id: 'dr-anna-whitmore',
          name: 'Dr. Anna Whitmore',
          role: 'Senior Aesthetic Physician & Orthodontist',
          experience: '12+ years',
          education: 'Harvard Medical School & Clinical Institute',
          bio: 'Dr. Anna Whitmore brings precision, gentleness, and an artistic eye to aesthetic smile makeovers and minimally invasive orthodontics. She has treated hundreds of children, teens, and adults with gentle care.',
          specialties: ['Aesthetic Treatments', 'Clear Aligners & Orthodontics', 'Pediatric Care', 'Preventative Care'],
        }
      ]
    },
    services: {
      title: 'We guarantee high quality clinical care',
      viewAll: 'View all services',
      learnMore: 'Learn more',
      bookThis: 'Book this procedure',
      close: 'Close',
      whatToExpect: 'What to expect with this procedure:',
      items: [
        {
          id: 'entrance-examination',
          title: 'Entrance examination',
          description: 'A comprehensive oral health evaluation including digital 3D panoramic imaging, gum health scoring, screening for early cavities, and a customized treatment plan.',
          price: '$65',
          duration: '45 mins',
          keyBenefits: [
            'Comprehensive 3D low-radiation digital radiography',
            'Gentle periodontal pocket and gum assessment',
            'Personalized preventative maintenance schedule',
            'Transparent treatment and insurance consultation'
          ]
        },
        {
          id: 'fill-therapy',
          title: 'Fill therapy',
          description: 'Tooth-colored composite resin fillings engineered to seamlessly blend with your natural enamel, restoring structural strength while preserving maximum healthy tooth structure.',
          price: '$120 - $210',
          duration: '30 - 60 mins',
          keyBenefits: [
            'Biocompatible nano-hybrid composite materials',
            'Shade-matched perfectly to your natural enamel',
            'Virtually pain-free local computer-assisted anesthesia',
            'Same-day single-visit restoration'
          ]
        },
        {
          id: 'fixed-prosthetic-care',
          title: 'Fixed prosthetic care',
          description: 'Precision zirconia and porcelain crowns, bridges, and veneers crafted to restore damaged teeth with biocompatible resilience and unmatched lifelike brilliance.',
          price: '$450 - $950',
          duration: '60 - 90 mins',
          keyBenefits: [
            'High-strength monolithic zirconia & ceramic porcelain',
            'Digital intraoral optical scanning (no goopy impressions)',
            'Natural light-refraction indistinguishable from real teeth',
            'Long-term structural warranty and bite calibration'
          ]
        }
      ]
    },
    testimonials: {
      title: 'Real experiences\n& stories from our patients',
      items: [
        {
          id: 'sam-l',
          quote: '“Exceptional care from start to finish! Dr. Patel and the staff at Gayetri Medical go above and beyond to make sure you’re comfortable and informed. My whole family trusts them!”',
          author: 'Samantha L.',
          treatment: 'Family Preventative & Cleaning',
        },
        {
          id: 'jess-t',
          quote: '“Dr. Smith and the team at Gayetri Medical made my clinic experience truly comfortable and stress-free. From the moment I walked in, I felt welcomed and cared for. The quality of their work is outstanding, and my smile has never looked better! Highly recommend!”',
          author: 'Jessica T.',
          treatment: 'Fill Therapy & Whitening',
        },
        {
          id: 'mike-r',
          quote: '“Gayetri Medical transformed my smile! Dr. Lee and his team are so professional and compassionate, making each visit pleasant and pain-free. I couldn’t be happier with the results.”',
          author: 'Michael R.',
          treatment: 'Prosthetic Crown & Bridge',
        }
      ]
    },
    locations: {
      title: 'Find the right location for you',
      moreAbout: 'More about locations',
      viewMore: 'View more',
      bookHere: 'Book here',
      modalBranch: 'Branch',
      operatingHours: 'Operating Hours',
      amenitiesTech: 'Clinic Amenities & Technology',
      bookAt: 'Book at',
      close: 'Close',
      items: [
        {
          id: 'levittown',
          name: 'Levittown',
          code: 'Lt',
          address: '308 Geneva Street',
          cityState: 'Levittown, NY 11756',
          phone: '+1 562-663-6564',
          email: 'levittown@medical.com',
          hours: {
            weekdays: 'Monday – Friday: 8:00 AM – 7:00 PM',
            saturday: 'Saturday: 9:00 AM – 4:00 PM',
            sunday: 'Sunday: Emergency Care Only',
          },
          features: ['Accessible Ramp & Elevator', 'Free Patient Parking', 'Child-Friendly Waiting Lounge', 'State-of-the-art 3D CBCT Scanner']
        },
        {
          id: 'lansing',
          name: 'Lansing',
          code: 'Ls',
          address: '342 John Avenue',
          cityState: 'Lansing, MI 48933',
          phone: '+1 562-663-6564',
          email: 'lansing@medical.com',
          hours: {
            weekdays: 'Monday – Friday: 8:00 AM – 6:30 PM',
            saturday: 'Saturday: 9:00 AM – 3:00 PM',
            sunday: 'Sunday: Closed',
          },
          features: ['Direct Transit Access', 'Private Treatment Suites', 'Noise-Canceling Headphones Provided', 'In-House Clinical Diagnostic Lab']
        },
        {
          id: 'newton',
          name: 'Newton',
          code: 'Nw',
          address: '4102 Morningview Lane',
          cityState: 'Newton, MA 02458',
          phone: '+1 562-663-6564',
          email: 'newton@medical.com',
          hours: {
            weekdays: 'Monday – Friday: 7:30 AM – 6:00 PM',
            saturday: 'Saturday: 8:30 AM – 2:00 PM',
            sunday: 'Sunday: Closed',
          },
          features: ['Complimentary Valet Parking', 'Heated Ergonomic Treatment Chairs', 'Comfort Sedation Options', 'Same-Day Crown Milling']
        }
      ]
    },
    faq: {
      tag: 'Patient Questions',
      title: 'Frequently asked questions',
      subtitle: 'Everything you need to know about preparing for your first visit, insurance coverage, and our gentle clinical procedures.',
      searchPlaceholder: 'Search questions (e.g. insurance, pain)...',
      clear: 'Clear',
      clearFilter: 'Clear filter',
      noMatch: 'No questions matched your search query',
      categories: {
        all: 'All Questions',
        'first-visit': 'First Visit & Comfort',
        procedures: 'Procedures & Tech',
        insurance: 'Insurance & Pricing',
        general: 'General & Emergencies',
      },
      supportTitle: 'Have a specific medical or insurance question?',
      supportDesc: 'Our clinical care coordinators are on hand to verify your benefits and walk you through any concern.',
      scheduleConsultation: 'Schedule consultation',
      items: [
        {
          id: 'first-exam',
          category: 'first-visit',
          question: 'What happens during my initial entrance examination?',
          answer:
            'Your initial visit takes approximately 45 minutes. Our physician performs a comprehensive health screening, oral tissue evaluation, digital low-radiation 3D imaging, and a complete wellness assessment. We then sit down with you to review our findings and discuss a personalized treatment plan with zero pressure.',
        },
        {
          id: 'clinical-anxiety',
          category: 'first-visit',
          question: 'How do you accommodate patients with medical fear or anxiety?',
          answer:
            'Gentle, stress-free care is at the core of Gayetri Medical. We provide noise-canceling headphones, ceiling entertainment screens, warm blankets, and painless computer-assisted local anesthesia. For patients requiring extra reassurance, we offer gentle oral conscious sedation options across all our clinic locations.',
        },
        {
          id: 'insurance-coverage',
          category: 'insurance',
          question: 'Which health insurance plans do you accept and how does billing work?',
          answer:
            'We accept and file claims with virtually all major health insurance providers, including MetLife, Cigna, Guardian, Aetna, and Humana. Our patient care coordinators verify your benefits beforehand and provide a transparent, upfront itemized cost breakdown before any procedure begins.',
        },
        {
          id: 'fill-materials',
          category: 'procedures',
          question: 'What materials are used for fill therapy and restorative crowns?',
          answer:
            'We are a 100% mercury-free practice. We exclusively use biocompatible, nano-hybrid composite resins for natural fillings and monolithic zirconia or lithium disilicate (E-Max) ceramics for crowns and bridges. These materials mimic the light refraction and resilience of natural healthy enamel.',
        },
        {
          id: 'cleaning-frequency',
          category: 'general',
          question: 'How frequently should adults and children schedule checkups?',
          answer:
            'For most healthy patients, healthcare professionals recommend a preventative cleaning and wellness checkup every six months. Patients managing ongoing treatments or wearing orthodontic appliances may benefit from supportive hygiene appointments every three to four months.',
        },
        {
          id: 'emergency-care',
          category: 'general',
          question: 'Do you offer emergency appointments for urgent pain or trauma?',
          answer:
            'Yes. All three of our clinic branches (Levittown, Lansing, and Newton) reserve dedicated daily emergency slots for sudden acute pain, fractured restorations, or urgent clinical accidents. Please call our central line at +1 562-663-6564 immediately for prompt same-day care.',
        },
        {
          id: 'whitening-safety',
          category: 'procedures',
          question: 'Is professional teeth whitening safe for sensitive teeth?',
          answer:
            'Absolutely. Our in-office whitening protocols use buffered hydrogen peroxide gels combined with desensitizing potassium nitrate and calcium phosphate. This prevents enamel dehydration and eliminates the acute zingers often caused by commercial over-the-counter strips.',
        }
      ]
    },
    contact: {
      title: 'We are here to help.',
      subtitle: 'Please fill out the form below to contact our team.',
      locationLabel: 'Location',
      locationPlaceholder: 'Select...',
      nameLabel: 'Name & Surname',
      namePlaceholder: 'Jane Smith',
      phoneLabel: 'Phone Number',
      phonePlaceholder: '+1 562-663-6564',
      emailLabel: 'Email',
      emailPlaceholder: 'jane@medical.com',
      disclaimer: 'By sending, you confirm that you are familiar with the processing of personal data.',
      submit: 'Submit',
      submitting: 'Sending...',
      thankYou: 'Thank you',
      successMsg: 'Your inquiry for our {location} clinic has been received. Our patient coordinator will contact you at {phone} or {email} within 2 business hours.',
      sendAnother: 'Send another message',
      errors: {
        location: 'Please select a preferred clinic location.',
        name: 'Please provide your full name.',
        phone: 'Please provide your phone number.',
        email: 'Please provide a valid email address.',
      }
    },
    footer: {
      tagline: 'Modern, patient-centered healthcare for all generations across Levittown, Lansing, and Newton.',
      bookAppointment: 'Book an appointment',
      pages: 'Pages',
      homepage: 'Homepage',
      locations: 'Locations',
      contact: 'Contact',
      about: 'About',
      services: 'Services',
      pricingCoverage: 'Pricing & Coverage',
      legalPrivacy: 'Legal & Privacy',
      notAvailable: '404 Page',
      copyright: '© 2026 Gayetri Medical. All rights reserved.',
      subtitle: 'Healthcare for the whole family',
      backToTop: 'Back to top',
    },
    bookingModal: {
      tag: 'Direct Scheduling',
      title: 'Book an appointment',
      subtitle: 'Select your preferred clinic branch, physician, and convenient time slot.',
      location: 'Location',
      service: 'Service',
      preferredDoctor: 'Preferred Doctor',
      anySpecialist: 'Any available specialist (Fastest slot)',
      date: 'Preferred Date',
      timeSlot: 'Preferred Time Slot',
      fullName: 'Full Name',
      phone: 'Phone Number',
      email: 'Email Address',
      notes: 'Special Notes or Symptoms (Optional)',
      notesPlaceholder: 'e.g. Sensitivity, wellness checkup, general consultation',
      confirm: 'Confirm Appointment Request',
      successTitle: 'Appointment Requested!',
      successDesc: 'We’ve reserved your provisional booking at {location} for {service} with {doctor}. Our clinical team will confirm with you via SMS/phone at {phone}.',
      patient: 'Patient:',
      clinic: 'Clinic:',
      reqDate: 'Requested Date:',
      done: 'Done',
      nextSlot: 'Next available slot',
    },
    pricingModal: {
      tag: 'Transparent Care',
      title: 'Pricing & Insurance Coverage',
      subtitle: 'We partner with major healthcare insurance networks and offer flexible 0% interest payment plans.',
      acceptedInsurances: 'Accepting MetLife, Cigna, Aetna, Guardian, and private pay.',
      bookWithInsurance: 'Book with Insurance',
    }
  },
  bn: {
    nav: {
      brand: 'গায়ত্রী মেডিকেল',
      home: 'হোম',
      about: 'আমাদের সম্পর্কে',
      services: 'সেবাসমূহ',
      availability: 'ডাক্তারের সময়সূচী',
      locations: 'শাখাসমূহ',
      faq: 'প্রশ্নোত্তর',
      doctorPanel: 'ডাক্তার প্যানেল',
      management: 'ম্যানেজমেন্ট',
      bookAppointment: 'অ্যাপয়েন্টমেন্ট নিন',
      bookShort: 'বুক করুন',
      toggleMenu: 'মেনু টগল করুন',
      closeMenu: 'মেনু বন্ধ করুন',
      openMenu: 'মেনু খুলুন',
      questionsCall: 'কোনো প্রশ্ন আছে? আমাদের সরাসরি কল করুন:',
      langSelect: 'ভাষা নির্বাচন করুন',
    },
    hero: {
      welcome: 'গায়ত্রী মেডিকেল ক্লিনিকে স্বাগতম',
      title: 'পুরো পরিবারের জন্য আধুনিক স্বাস্থ্যসেবা',
      bookAppointment: 'অ্যাপয়েন্টমেন্ট নিন',
      viewServices: 'সেবাসমূহ দেখুন',
      badge: 'কোমল ও আধুনিক পারিবারিক স্বাস্থ্যসেবা',
      imgAlt: 'সুস্থ ও হাসিমুখের পরিবার এবং পারিবারিক স্বাস্থ্যসেবা',
    },
    about: {
      tag: 'আমাদের সম্পর্কে',
      statement: 'গায়ত্রী মেডিকেলে আপনার স্বাচ্ছন্দ্য এবং সামগ্রিক স্বাস্থ্যসেবা আমাদের প্রধান অগ্রাধিকার। আমরা বিশ্বাস করি ক্লিনিক পরিদর্শন হওয়া উচিত সম্পূর্ণ চাপমুক্ত এবং আপনার সার্বিক কল্যাণের প্রতি নিবেদিত।',
      stat1Number: '১৫+',
      stat1Label: 'বছরের অভিজ্ঞতা',
      stat2Number: '২০',
      stat2Label: 'বিশেষজ্ঞ চিকিৎসক',
      stat3Number: '৫০০+',
      stat3Label: 'সুস্থ ও সন্তুষ্ট রোগী',
    },
    team: {
      title: 'আমাদের বিশেষজ্ঞ দল',
      learnMore: 'বিস্তারিত জানুন',
      viewProfile: 'প্রোফাইল ও বিশেষত্ব দেখুন',
      bookWith: 'অ্যাপয়েন্টমেন্ট বুক করুন -',
      aboutBackground: 'অভিজ্ঞতা ও শিক্ষাগত পটভূমি',
      specialties: 'বিশেষজ্ঞতার ক্ষেত্রসমূহ',
      back: 'ফিরে যান',
      doctors: [
        {
          id: 'dr-peter-malloy',
          name: 'ডাঃ পিটার ম্যালয়',
          role: 'প্রধান প্রস্থোডন্টিস্ট ও ইমপ্লান্টোলজিস্ট',
          experience: '১৮+ বছর',
          education: 'কলাম্বিয়া ইউনিভার্সিটি কলেজ অব ফিজিশিয়ান্স অ্যান্ড সার্জনস',
          bio: 'ডাঃ পিটার ম্যালয় রেস্টোরেটিভ চিকিৎসা, জটিল প্রস্থেটিক্স এবং ইমপ্লান্ট পুনর্বাসনে বিশেষভাবে পারদর্শী। ১৮ বছরেরও বেশি সময় ধরে তিনি ব্যথাহীন আধুনিক প্রযুক্তি ও দীর্ঘস্থায়ী চিকিৎসায় নেতৃত্ব দিচ্ছেন।',
          specialties: ['প্রস্থেটিক কেয়ার', 'ইমপ্লান্ট সার্জারি', 'সম্পূর্ণ মুখ পুনর্বাসন', 'পারিবারিক স্বাস্থ্যসেবা'],
        },
        {
          id: 'dr-anna-whitmore',
          name: 'ডাঃ অ্যানা হুইটমোর',
          role: 'সিনিয়র নান্দনিক ফিজিশিয়ান ও অর্থোডন্টিস্ট',
          experience: '১২+ বছর',
          education: 'হার্ভার্ড মেডিকেল স্কুল ও ক্লিনিকাল ইনস্টিটিউট',
          bio: 'ডাঃ অ্যানা হুইটমোর শিশুদের ও প্রাপ্তবয়স্কদের মৃদু ও যত্নশীল স্বাস্থ্য রূপান্তর এবং অদৃশ্য অর্থোডন্টিক্সে অত্যন্ত দক্ষ। তিনি শত শত রোগীর মুখে স্বাভাবিক ও সুন্দর হাসি ফিরিয়ে এনেছেন।',
          specialties: ['নান্দনিক ফিলিং', 'ক্লিয়ার অ্যালাইনার ও অর্থোডন্টিক্স', 'শিশু বিশেষজ্ঞ সেবা', 'প্রতিরোধমূলক পরিচর্যা'],
        }
      ]
    },
    services: {
      title: 'আমরা নিশ্চিত করি সর্বোচ্চ মানের চিকিৎসা ও স্বাস্থ্যসেবা',
      viewAll: 'সব সেবাসমূহ দেখুন',
      learnMore: 'বিস্তারিত জানুন',
      bookThis: 'এই সেবাটি বুক করুন',
      close: 'বন্ধ করুন',
      whatToExpect: 'এই চিকিৎসার ক্ষেত্রে কী আশা করবেন:',
      items: [
        {
          id: 'entrance-examination',
          title: 'প্রাথমিক স্বাস্থ্য ও শারীরিক পরীক্ষা',
          description: 'ডিজিটাল ৩ডি প্যানোরামিক ইমেজিং, সামগ্রিক স্বাস্থ্য মূল্যায়ন, রোগ লক্ষণ পরীক্ষণ এবং ব্যক্তিগত চিকিৎসা পরিকল্পনাসহ সম্পূর্ণ শারীরিক পরীক্ষণ।',
          price: '$৬৫',
          duration: '৪৫ মিনিট',
          keyBenefits: [
            'কম রেডিয়েশনের অত্যাধুনিক ৩ডি ডিজিটাল এক্স-রে',
            'সূক্ষ্ম ও ব্যথাহীন শারীরিক পরীক্ষা',
            'ব্যক্তিগত প্রতিরোধমূলক যত্ন ও সুস্থতার পরিকল্পনা',
            'স্বচ্ছ চিকিৎসা খরচ ও বীমা সুবিধা আলোচনা'
          ]
        },
        {
          id: 'fill-therapy',
          title: 'কম্পোজিট ফিল থেরাপি',
          description: 'দাঁতের রঙের সাথে নিখুঁতভাবে মেলে এমন বায়ো-কম্প্যাটিবল ন্যানো-কম্পোজিট রেজিন ফিলিং, যা দাঁতের প্রাকৃতিক গঠন অটুট রেখে শক্তি ফিরিয়ে আনে।',
          price: '$১২০ - $২১০',
          duration: '৩০ - ৬০ মিনিট',
          keyBenefits: [
            'উন্নত বায়ো-কম্প্যাটিবল ন্যানো-হাইব্রিড উপকরণ',
            'আপনার আসল দাঁতের রঙের সাথে নিখুঁত রঙের সামঞ্জস্য',
            'কম্পিউটার-নিয়ন্ত্রিত সম্পূর্ণ ব্যথাহীন অ্যানেস্থেশিয়া',
            'একই দিনে একক সাক্ষাতেই সম্পন্ন'
          ]
        },
        {
          id: 'fixed-prosthetic-care',
          title: 'স্থায়ী কৃত্রিম দাঁত ও প্রস্থেটিক্স',
          description: 'ভাঙা বা ক্ষতিগ্রস্ত দাঁত পুনর্নির্মাণে প্রিসিশন জিরকোনিয়া ও সিরামিক ক্রাউন, ব্রিজ ও ভিনিয়ার্স, যা আসল দাঁতের মতোই মজবুত ও উজ্জ্বল।',
          price: '$৪৫০ - $৯৫০',
          duration: '৬০ - ৯০ মিনিট',
          keyBenefits: [
            'অতিরিক্ত টেকসই মনোলিথিক জিরকোনিয়া ও সিরামিক সিরামিক্স',
            'ডিজিটাল ইন্ট্রাওরাল ৩ডি অপটিক্যাল স্ক্যানিং',
            'আসল দাঁতের মতো প্রাকৃতিক আলো প্রতিফলন',
            'দীর্ঘমেয়াদী কাঠামোগত নিশ্চয়তা ও কামড়ের ভারসাম্য'
          ]
        }
      ]
    },
    testimonials: {
      title: 'আমাদের রোগীদের বাস্তব অভিজ্ঞতা\nও অনুপ্রেরণামূলক গল্প',
      items: [
        {
          id: 'sam-l',
          quote: '“শুরু থেকে শেষ পর্যন্ত অসাধারণ সেবা! মেডিকেলের চিকিৎসকরা অত্যন্ত যত্নবান এবং তারা প্রতিটি পদক্ষেপ সুন্দরভাবে বুঝিয়ে দেন। আমাদের পুরো পরিবার তাদের অন্ধভাবে বিশ্বাস করে!”',
          author: 'সামান্থা এল.',
          treatment: 'পারিবারিক প্রতিরোধমূলক পরিচ্ছন্নতা',
        },
        {
          id: 'jess-t',
          quote: '“গায়ত্রী মেডিকেলে এসে আমার চিকিৎসা ভীতি পুরোপুরি দূর হয়ে গেছে। প্রবেশের মুহূর্ত থেকেই আমি আন্তরিক অভ্যর্থনা ও সর্বোচ্চ যত্ন পেয়েছি। আমার স্বাস্থ্য ও হাসি এখন চমৎকার!”',
          author: 'জেসিকা টি.',
          treatment: 'ফিল থেরাপি ও যত্ন',
        },
        {
          id: 'mike-r',
          quote: '“গায়ত্রী মেডিকেল আমার চিকিৎসার সমস্যা চমৎকারভাবে সমাধান করেছে! চিকিৎসকরা অত্যন্ত বিনয়ী ও সহানুভূতিশীল, যার ফলে প্রতিটি চিকিৎসা ছিল ব্যথামুক্ত ও স্বস্তিদায়ক।”',
          author: 'মাইকেল আর.',
          treatment: 'প্রস্থেটিক ক্রাউন ও ব্রিজ প্রতিস্থাপন',
        }
      ]
    },
    locations: {
      title: 'আপনার সুবিধাজনক শাখা নির্বাচন করুন',
      moreAbout: 'শাখাসমূহ সম্পর্কে জানুন',
      viewMore: 'বিস্তারিত দেখুন',
      bookHere: 'এখানে বুক করুন',
      modalBranch: 'শাখা',
      operatingHours: 'কার্যসময়',
      amenitiesTech: 'ক্লিনিকের সুযোগ-সুবিধা ও প্রযুক্তি',
      bookAt: 'বুক করুন -',
      close: 'বন্ধ করুন',
      items: [
        {
          id: 'levittown',
          name: 'লেভিটাউন',
          code: 'Lt',
          address: '৩০৮ জেনেভা স্ট্রিট',
          cityState: 'লেভিটাউন, নিউ ইয়র্ক ১১৭৫৬',
          phone: '+১ ৫৬২-৬৬৩-৬৫৬৪',
          email: 'levittown@medical.com',
          hours: {
            weekdays: 'সোম – শুক্র: সকাল ৮:০০ – সন্ধ্যা ৭:০০',
            saturday: 'শনিবার: সকাল ৯:০০ – বিকেল ৪:০০',
            sunday: 'রবিবার: শুধুমাত্র জরুরি সেবা',
          },
          features: ['হুইলচেয়ার র‍্যাম্প ও লিফট', 'বিনামূল্যে রোগীর পার্কিং', 'শিশু-বান্ধব বিশ্রাম কক্ষ', 'আধুনিক ৩ডি সিবিসিটি স্ক্যানার']
        },
        {
          id: 'lansing',
          name: 'ল্যান্সিং',
          code: 'Ls',
          address: '৩৪২ জন অ্যাভিনিউ',
          cityState: 'ল্যান্সিং, মিশিগান ৪৮৯৩৩',
          phone: '+১ ৫৬২-৬৬৩-৬৫৬৪',
          email: 'lansing@medical.com',
          hours: {
            weekdays: 'সোম – শুক্র: সকাল ৮:০০ – সন্ধ্যা ৬:৩০',
            saturday: 'শনিবার: সকাল ৯:০০ – বিকেল ৩:০০',
            sunday: 'রবিবার: বন্ধ',
          },
          features: ['সরাসরি গণপরিবহন সংযোগ', 'ব্যক্তিগত চিকিৎসা কক্ষ', 'নয়েজ-ক্যানসেলিং হেডফোন সুবিধা', 'ইন-হাউস নিজস্ব ক্লিনিকাল ডায়াগনস্টিক ল্যাব']
        },
        {
          id: 'newton',
          name: 'নিউটন',
          code: 'Nw',
          address: '৪১০২ মর্নিংভিউ লেন',
          cityState: 'নিউটন, ম্যাসাচুসেটস ০২৪৫৮',
          phone: '+১ ৫৬২-৬৬৩-৬৫৬৪',
          email: 'newton@medical.com',
          hours: {
            weekdays: 'সোম – শুক্র: সকাল ৭:৩০ – সন্ধ্যা ৬:০০',
            saturday: 'শনিবার: সকাল ৮:৩০ – দুপুর ২:০০',
            sunday: 'রবিবার: বন্ধ',
          },
          features: ['কমপ্লিমেন্টারি ভ্যালেট পার্কিং', 'উত্তপ্ত আরামদায়ক ক্লিনিকাল চেয়ার', 'মৃদু সিডেশন ব্যবস্থা', 'একই দিনে ক্রাউন মিলিং প্রযুক্তি']
        }
      ]
    },
    faq: {
      tag: 'রোগীদের জিজ্ঞাসা',
      title: 'সচরাচর জিজ্ঞাসিত প্রশ্নাবলী',
      subtitle: 'প্রথম সাক্ষাতের প্রস্তুতি, স্বাস্থ্য বীমা এবং আমাদের ব্যথাহীন চিকিৎসা পদ্ধতি সম্পর্কিত সব তথ্য।',
      searchPlaceholder: 'প্রশ্ন খুঁজুন (যেমন: বীমা, ব্যথা, খরচ)...',
      clear: 'মুছুন',
      clearFilter: 'ফিল্টার সরান',
      noMatch: 'আপনার অনুসন্ধানের সাথে কোনো প্রশ্ন মেলেনি',
      categories: {
        all: 'সব প্রশ্ন',
        'first-visit': 'প্রথম পরিদর্শন ও স্বস্তি',
        procedures: 'পদ্ধতি ও প্রযুক্তি',
        insurance: 'বীমা ও মূল্যতালিকা',
        general: 'সাধারণ ও জরুরি সেবা',
      },
      supportTitle: 'আপনার কি কোনো সুনির্দিষ্ট চিকিৎসা বা বীমা সংক্রান্ত প্রশ্ন আছে?',
      supportDesc: 'আমাদের কেয়ার কোঅর্ডিনেটররা আপনার বীমা সুবিধা যাচাই করতে এবং যেকোনো প্রশ্নের উত্তর দিতে প্রস্তুত।',
      scheduleConsultation: 'পরামর্শের সময় নির্ধারণ করুন',
      items: [
        {
          id: 'first-exam',
          category: 'first-visit',
          question: 'আমার প্রথম শারীরিক পরীক্ষায় কী কী করা হয়?',
          answer:
            'আপনার প্রথম পরিদর্শন প্রায় ৪৫ মিনিট সময় নেয়। আমাদের অভিজ্ঞ চিকিৎসক সার্বিক স্বাস্থ্য মূল্যায়ন, ভাইটালস ও রক্তচাপ পরীক্ষা, কম রেডিয়েশনের ৩ডি এক্স-রে এবং সুস্থতার মূল্যায়ন করেন। এরপর আমরা সম্পূর্ণ স্বচ্ছতার সাথে আপনার সাথে বিস্তারিত আলোচনা করে একটি সুবিধাজনক পরিকল্পনা তৈরি করি।',
        },
        {
          id: 'clinical-anxiety',
          category: 'first-visit',
          question: 'চিকিৎসা ভীতি বা উদ্বেগে থাকা রোগীদের আপনারা কীভাবে সাহায্য করেন?',
          answer:
            'কোমল ও চাপমুক্ত সেবা আমাদের প্রধান মূলনীতি। আমরা রোগীদের আরামের জন্য নয়েজ-ক্যানসেলিং হেডফোন, ছাদের বিনোদন স্ক্রিন, উষ্ণ কম্বল এবং কম্পিউটার-নিয়ন্ত্রিত মৃদু ব্যথাহীন অ্যানেস্থেশিয়া প্রদান করি। যাদের অতিরিক্ত স্বস্তি প্রয়োজন, তাদের জন্য মৃদু ও নিরাপদ সিডেশনের ব্যবস্থা রয়েছে।',
        },
        {
          id: 'insurance-coverage',
          category: 'insurance',
          question: 'আপনারা কোন কোন স্বাস্থ্য বীমা গ্রহণ করেন এবং পেমেন্ট কীভাবে হয়?',
          answer:
            'আমরা মেটলাইফ, সিগনা, গার্ডিয়ান, এটনা এবং হিউমানাসহ প্রায় সব প্রধান পিপিও (PPO) বীমা গ্রহণ করি। চিকিৎসা শুরুর আগেই আমাদের সমন্বয়কারীরা আপনার বীমা কাভারেজ যাচাই করে সম্পূর্ণ স্বচ্ছ খরচের হিসাব লিখিতভাবে বুঝিয়ে দেন।',
        },
        {
          id: 'fill-materials',
          category: 'procedures',
          question: 'ফিলিং ও ক্রাউনের জন্য কী ধরণের উপকরণ ব্যবহার করা হয়?',
          answer:
            'আমাদের ক্লিনিক সম্পূর্ণ পারদ-মুক্ত (Mercury-Free)। আমরা ফিলিংয়ের জন্য উচ্চমানের প্রাকৃতিক রঙের ন্যানো-কম্পোজিট রেজিন এবং ক্রাউন ও ব্রিজের জন্য প্রাকৃতিক জিরকোনিয়া ও সিরামিক ব্যবহার করি। এগুলো দীর্ঘস্থায়ী ও স্বাস্থ্যসম্মত।',
        },
        {
          id: 'cleaning-frequency',
          category: 'general',
          question: 'কত দিন পর পর স্বাস্থ্য চেকআপ করানো উচিত?',
          answer:
            'সাধারণত প্রতি ৬ মাস পর পর নিয়মিত প্রফেশনাল স্বাস্থ্য স্ক্রীনিং ও চেকআপ করানোর পরামর্শ দেওয়া হয়। কোনো দীর্ঘমেয়াদী সমস্যা থাকলে চিকিৎসকের পরামর্শ অনুযায়ী নিয়মিত পরিচর্যা করা ভালো।',
        },
        {
          id: 'emergency-care',
          category: 'general',
          question: 'তীব্র ব্যথা বা জরুরি শারীরিক সমস্যার ক্ষেত্রে কি অ্যাপয়েন্টমেন্ট পাওয়া যায়?',
          answer:
            'হ্যাঁ, আমাদের তিনটি শাখাতেই (লেভিটাউন, ল্যান্সিং ও নিউটন) প্রতিদিন জরুরি ব্যথাজনিত রোগীদের জন্য নির্ধারিত সময় সংরক্ষিত থাকে। দ্রুত একই দিনে সেবা পেতে অবিলম্বে আমাদের সেন্ট্রাল নম্বরে +১ ৫৬২-৬৬৩-৬৫৬৪ কল করুন।',
        },
        {
          id: 'whitening-safety',
          category: 'procedures',
          question: 'সেনসিটিভ দাঁতের জন্য প্রফেশনাল টিথ হোয়াইটেনিং কি নিরাপদ?',
          answer:
            'অবশ্যই। আমাদের ক্লিনিকে নিরাপদ হাইড্রোজেন পারক্সাইড জেলের সাথে ডেসেনসিটাইজিং উপাদান ব্যবহার করা হয়। এটি কোনো ধরণের সংবেদনশীলতা বা তীব্র শিরশির অনুভূতি ছাড়াই দাঁতকে উজ্জ্বল ও সাদা করে তোলে।',
        }
      ]
    },
    contact: {
      title: 'আমরা সাহায্য করতে প্রস্তুত।',
      subtitle: 'আমাদের দলের সাথে যোগাযোগ করতে নিচের ফর্মটি পূরণ করুন।',
      locationLabel: 'শাখা',
      locationPlaceholder: 'নির্বাচন করুন...',
      nameLabel: 'নাম ও পদবি',
      namePlaceholder: 'ফারহানা ইসলাম',
      phoneLabel: 'ফোন নম্বর',
      phonePlaceholder: '+১ ৫৬২-৬৬৩-৬৫৬৪',
      emailLabel: 'ইমেইল ঠিকানা',
      emailPlaceholder: 'farhana@example.com',
      disclaimer: 'ফর্ম পাঠানোর মাধ্যমে আপনি ব্যক্তিগত তথ্য প্রক্রিয়াকরণের শর্তাবলীর সাথে সম্মতি প্রকাশ করছেন।',
      submit: 'পাঠান',
      submitting: 'পাঠানো হচ্ছে...',
      thankYou: 'ধন্যবাদ',
      successMsg: 'আমাদের {location} শাখার জন্য আপনার বার্তা সফলভাবে গৃহীত হয়েছে। আমাদের পেশেন্ট কোঅর্ডিনেটর ২ ঘণ্টার মধ্যে আপনার {phone} বা {email} এ যোগাযোগ করবেন।',
      sendAnother: 'আরেকটি বার্তা পাঠান',
      errors: {
        location: 'অনুগ্রহ করে আপনার পছন্দের শাখা নির্বাচন করুন।',
        name: 'অনুগ্রহ করে আপনার সম্পূর্ণ নাম লিখুন।',
        phone: 'অনুগ্রহ করে আপনার ফোন নম্বর প্রদান করুন।',
        email: 'অনুগ্রহ করে একটি সঠিক ইমেইল ঠিকানা দিন।',
      }
    },
    footer: {
      tagline: 'লেভিটাউন, ল্যান্সিং এবং নিউটনে পুরো পরিবারের জন্য আধুনিক ও সহানুভূতিশীল স্বাস্থ্যসেবা।',
      bookAppointment: 'অ্যাপয়েন্টমেন্ট নিন',
      pages: 'পৃষ্ঠাসমূহ',
      homepage: 'হোমপেজ',
      locations: 'শাখাসমূহ',
      contact: 'যোগাযোগ',
      about: 'আমাদের সম্পর্কে',
      services: 'সেবাসমূহ',
      pricingCoverage: 'মূল্যতালিকা ও বীমা',
      legalPrivacy: 'গোপনীয়তা ও শর্তাবলী',
      notAvailable: '৪০৪ পৃষ্ঠা',
      copyright: '© ২০২৬ গায়ত্রী মেডিকেল। সর্বস্বত্ব সংরক্ষিত।',
      subtitle: 'পুরো পরিবারের জন্য আধুনিক স্বাস্থ্যসেবা',
      backToTop: 'উপরে ফিরে যান',
    },
    bookingModal: {
      tag: 'অনলাইন বুকিং',
      title: 'অ্যাপয়েন্টমেন্ট নিন',
      subtitle: 'আপনার পছন্দের শাখা, চিকিৎসক এবং সুবিধাজনক সময় নির্বাচন করুন।',
      location: 'শাখা',
      service: 'সেবা',
      preferredDoctor: 'পছন্দের চিকিৎসক',
      anySpecialist: 'যেকোনো উপলব্ধ বিশেষজ্ঞ (দ্রুততম সময়)',
      date: 'পছন্দের তারিখ',
      timeSlot: 'পছন্দের সময়সূচী',
      fullName: 'সম্পূর্ণ নাম',
      phone: 'ফোন নম্বর',
      email: 'ইমেইল ঠিকানা',
      notes: 'বিশেষ কোনো উপসর্গ বা নোট (ঐচ্ছিক)',
      notesPlaceholder: 'যেমন: শারীরিক অস্বস্তি, সাধারণ চেকআপ, পরামর্শ',
      confirm: 'অ্যাপয়েন্টমেন্ট অনুরোধ নিশ্চিত করুন',
      successTitle: 'অ্যাপয়েন্টমেন্টের অনুরোধ সফল হয়েছে!',
      successDesc: 'আমরা {location} শাখায় {doctor}-এর সাথে {service}-এর জন্য আপনার স্লট সাময়িকভাবে সংরক্ষণ করেছি। আমাদের দল শীঘ্রই {phone} নম্বরে নিশ্চিত করবে।',
      patient: 'রোগী:',
      clinic: 'শাখা:',
      reqDate: 'অনুরোধকৃত তারিখ:',
      done: 'সম্পন্ন',
      nextSlot: 'পরবর্তী উপলব্ধ স্লট',
    },
    pricingModal: {
      tag: 'স্বচ্ছ মূল্যব্যবস্থা',
      title: 'মূল্যতালিকা ও বীমা সুবিধা',
      subtitle: 'আমরা প্রধান প্রধান স্বাস্থ্য বীমা গ্রহণ করি এবং ০% সুদে সুবিধাজনক কিস্তির ব্যবস্থা রয়েছে।',
      acceptedInsurances: 'মেটলাইফ, সিগনা, এটনা, গার্ডিয়ান এবং নিজস্ব পেমেন্ট গ্রহণযোগ্য।',
      bookWithInsurance: 'বীমা সহ বুক করুন',
    }
  }
};

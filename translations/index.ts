export type TranslationKey = keyof typeof translations.en;

const translations = {
  en: {
    // Header / Navigation
    nav_home: "Home",
    nav_service: "Service",
    nav_work: "work",
    nav_products: "Products",
    nav_about_us: "About Us",
    nav_contact_us: "Contact Us",
    language: "EN",
    get_a_quote: "Get a Quote",
    
    // Hero Section
    hero_title_complete: "Complete",
    hero_title_digital: "Digital",
    hero_title_solutions: "Solutions",
    hero_title_under_one_roof: "Under One Roof",
    hero_description: "Every business reaches a point where spreadsheets, outdated websites, and disconnected tools start holding it back. We build the websites, apps, and systems that move you past it.",
    hero_start_project: "Start a Project",
    hero_see_work: "See Our Work",
    hero_scroll_explore: "Scroll to explore",
    
    // Business Section
    business_trusted_partnerships: "Trusted partnerships",
    business_grew_with_us: "Businesses that grew with us",
    
    // Service Section
    services_label: "Services",
    services_heading: "Let's talk business",
    services_mobile_development: "Mobile Development",
    services_web_development: "Web Development",
    services_software_development: "Software Development",
    services_marketing: "Marketing",
    services_graphic_design: "Graphic Design",
    services_seo: "SEO",
    explore_service: "Explore",
    
    // Project Section
    projects_label: "Our work",
    projects_heading: "Real projects real results",
    projects_view_all: "View All Projects",
    
    // Testimonials Section
    testimonials_label: "Testimonials",
    testimonials_heading: "What our clients say",
    testimonials_loading: "Loading testimonials...",
    testimonials_no_data: "No testimonials available",
    
    // FAQ Section
    faq_label: "FAQ",
    faq_heading: "Everything you need to know about working with us.",
    faq_loading: "Loading FAQs...",
    faq_error: "Failed to load FAQs. Please try again later.",
    
    // Footer
    footer_have_project: "Have a project in mind? Let's talk.",
    footer_contact_us: "Contact Us",
    footer_description: "Tech Gear Solutions is a technology company delivering innovative software, web, and mobile solutions that empower businesses to grow, adapt, and lead.",
    footer_follow_us: "Follow Us",
    footer_quick_action: "Quick action",
    footer_contact_us_heading: "contact Us",
    footer_powered_by: "Powered By Tech Gear Solutions",
    footer_rights_reserved: "© 2026 All Rights Reserved",
    footer_location: "Hurghada, El Kawther, Metro ST, next to Abdeen pharmacy.",
    
    // About Page
    about_breadcrumb: "About Us",
    about_heading: "Building Digital Solutions That Move Businesses Forward",
    about_description_1: "At Tech Gear, we combine technology, creativity, and business thinking to help companies build stronger digital experiences and grow with confidence.",
    about_description_2: "From websites and mobile applications to custom software and digital marketing, we create solutions designed around real business needs. Our approach brings strategy, design, development, and growth together under one roof.",
    about_mission_title: "Our Mission",
    about_mission_text: "To turn complex business challenges into clear, useful digital solutions that create lasting value.",
    about_vision_title: "Our Vision",
    about_vision_text: "To help every ambitious business use technology with confidence, clarity, and purpose.",
    about_team_heading: "Our Team",
    about_team_loading: "Loading team members...",
    about_team_error: "Failed to load team members",
    about_team_no_data: "No team members found",
    about_journey_heading: "Our Journey",
    about_journey_loading: "Loading journey...",
    about_journey_error: "Failed to load journey",
    about_journey_no_data: "No journey items found",
    about_cta_heading: "Have a project in mind? Let's talk.",
    
    // Contact Page
    contact_breadcrumb: "Contact Us",
    contact_heading: "Have questions? Feel free to write us",
    contact_description: "Have a question or need more information about our services? Fill out the form below and we'll get back to you as soon as possible.",
    contact_your_name: "Your name",
    contact_name_placeholder: "Enter Name",
    contact_email: "Email address",
    contact_email_placeholder: "Enter Email",
    contact_phone: "Phone number",
    contact_phone_placeholder: "Enter Phone Number",
    contact_subject: "Subject",
    contact_subject_placeholder: "Enter Subject",
    contact_message: "Message",
    contact_message_placeholder: "Write your message",
    contact_send_button: "Send Message",
    contact_sending: "Sending...",
    contact_message_sent: "Message Sent",
    contact_success_message: "Thanks. We'll be in touch soon.",
    contact_location_title: "Location",
    contact_call_us_title: "Call Us",
    contact_email_title: "Email",
    contact_follow_us_title: "Follow Us",
    contact_error: "Failed to send message. Please try again.",
    
    // Products Page
    products_breadcrumb: "Products",
    products_heading: "Our Products",
    products_loading: "Loading products...",
    products_error: "Failed to load products",
    products_no_data: "No products available",
    product_view_details: "View Details",
    product_live_demo: "Live Demo",
    
    // Work/Projects Page
    work_breadcrumb: "work",
    work_heading: "Our Work Portfolio",
    work_description: "Explore our portfolio of successful projects delivered to clients worldwide",
    work_loading: "Loading projects...",
    work_error: "Failed to load projects",
    work_no_data: "No projects available",
    work_view_project: "View Project",
    
    // Service Details Page
    service_breadcrumb: "Services",
    service_loading: "Loading service details...",
    service_error: "Service not found",
    service_technologies: "Technologies We Use",
    service_details: "Service Details",
    service_back_to_services: "Back to Services",
    
    // Product Details Page
    product_breadcrumb: "Products",
    product_loading: "Loading product details...",
    product_error: "Product not found",
    product_details: "Product Details",
    product_images: "Product Images",
    product_back_to_products: "Back to Products",
    
    // Common/General
    loading: "Loading...",
    error: "Error",
    retry: "Retry",
    close: "Close",
    open: "Open",
    menu: "Menu",
    read_more: "Read More",
    learn_more: "Learn More",
    view_all: "View All",
    back: "Back",
    next: "Next",
    previous: "Previous",
    submit: "Submit",
    cancel: "Cancel",
    search: "Search",
    filter: "Filter",
    sort: "Sort",
    clear: "Clear",
    apply: "Apply",
    select_language: "Select language",
    open_menu: "Open menu",
    close_menu: "Close menu",
  },
  ar: {
    // Header / Navigation
    nav_home: "الرئيسية",
    nav_service: "الخدمات",
    nav_work: "أعمالنا",
    nav_products: "المنتجات",
    nav_about_us: "من نحن",
    nav_contact_us: "اتصل بنا",
    language: "AR",
    get_a_quote: "احصل على عرض",
    
    // Hero Section
    hero_title_complete: "حلول",
    hero_title_digital: "رقمية",
    hero_title_solutions: "متكاملة",
    hero_title_under_one_roof: "تحت سقف واحد",
    hero_description: "كل شركة تصل إلى نقطة تبدأ فيها جداول البيانات والمواقع القديمة والأدوات المنفصلة في إعاقتها. نحن نبني المواقع والتطبيقات والأنظمة التي تتجاوز ذلك.",
    hero_start_project: "ابدء مشروعك",
    hero_see_work: "شاهد أعمالنا",
    hero_scroll_explore: "مرر للاستكشاف",
    
    // Business Section
    business_trusted_partnerships: "شراكات موثوقة",
    business_grew_with_us: "الشركات التي نمت معنا",
    
    // Service Section
    services_label: "الخدمات",
    services_heading: "دعنا نتحدث عن العمل",
    services_mobile_development: "تطوير تطبيقات الهاتف",
    services_web_development: "تطوير المواقع",
    services_software_development: "تطوير البرمجيات",
    services_marketing: "التسويق",
    services_graphic_design: "التصميم الجرافيكي",
    services_seo: "تحسين محركات البحث",
    explore_service: "استكشف",
    
    // Project Section
    projects_label: "أعمالنا",
    projects_heading: "مشاريع حقيقية، نتائج حقيقية",
    projects_view_all: "عرض جميع المشاريع",
    
    // Testimonials Section
    testimonials_label: "آراء العملاء",
    testimonials_heading: "ماذا يقول عملاؤنا عنا",
    testimonials_loading: "جاري تحميل الآراء...",
    testimonials_no_data: "لا توجد آراء متاحة",
    
    // FAQ Section
    faq_label: "الأسئلة الشائعة",
    faq_heading: "كل ما تحتاج إلى معرفته عن العمل معنا.",
    faq_loading: "جاري تحميل الأسئلة...",
    faq_error: "فشل تحميل الأسئلة. يرجى المحاولة مرة أخرى.",
    
    // Footer
    footer_have_project: "لديك مشروع في ذهنك؟ دعنا نتحدث.",
    footer_contact_us: "اتصل بنا",
    footer_description: "تيك جير سوليوشنز هي شركة تقنية تقدم حلولاً برمجية ومواقع وتطبيقات جوال مبتكرة تمكّن الشركات من النمو والتكيف والقيادة.",
    footer_follow_us: "تابعنا",
    footer_quick_action: "روابط سريعة",
    footer_contact_us_heading: "اتصل بنا",
    footer_powered_by: "مدعوم بواسطة تيك جير سوليوشنز",
    footer_rights_reserved: "© 2026 جميع الحقوق محفوظة",
    footer_location: "الغردقة، الكوثر، شارع المترو، بجوار صيدلية عابدين.",
    
    // About Page
    about_breadcrumb: "من نحن",
    about_heading: "نبني حلولًا رقمية تدفع الأعمال إلى الأمام",
    about_description_1: "في Tech Gear، نجمع بين التكنولوجيا والإبداع والفكر التجاري لمساعدة الشركات على بناء تجارب رقمية أقوى وتحقيق النمو بثقة.",
    about_description_2: "من المواقع الإلكترونية وتطبيقات الهواتف المحمولة إلى البرمجيات المخصصة والتسويق الرقمي، نقدم حلولًا مصممة وفقًا لاحتياجات الأعمال الحقيقية. يجمع نهجنا بين الاستراتيجية والتصميم والتطوير والنمو تحت سقف واحد.",
    about_mission_title: "مهمتنا",
    about_mission_text: "تحويل تحديات الأعمال المعقدة إلى حلول رقمية واضحة ومفيدة تحقق قيمة مستدامة.",
    about_vision_title: "رؤيتنا",
    about_vision_text: "مساعدة كل عمل طموح على استخدام التكنولوجيا بثقة ووضوح وهدف.",
    about_team_heading: "فريقنا",
    about_team_loading: "جاري تحميل أعضاء الفريق...",
    about_team_error: "فشل تحميل أعضاء الفريق",
    about_team_no_data: "لم يتم العثور على أعضاء فريق",
    about_journey_heading: "رحلتنا",
    about_journey_loading: "جاري تحميل الرحلة...",
    about_journey_error: "فشل تحميل الرحلة",
    about_journey_no_data: "لم يتم العثور على عناصر الرحلة",
    about_cta_heading: "لديك مشروع في ذهنك؟ لنتحدث.",
    
    // Contact Page
    contact_breadcrumb: "اتصل بنا",
    contact_heading: "لديك أسئلة؟ لا تتردد في الكتابة إلينا",
    contact_description: "لديك سؤال أو تحتاج إلى مزيد من المعلومات حول خدماتنا؟ املأ النموذج أدناه وسنعاود الاتصال بك في أقرب وقت ممكن.",
    contact_your_name: "اسمك",
    contact_name_placeholder: "أدخل الاسم",
    contact_email: "عنوان البريد الإلكتروني",
    contact_email_placeholder: "أدخل البريد الإلكتروني",
    contact_phone: "رقم الهاتف",
    contact_phone_placeholder: "أدخل رقم الهاتف",
    contact_subject: "الموضوع",
    contact_subject_placeholder: "أدخل الموضوع",
    contact_message: "الرسالة",
    contact_message_placeholder: "اكتب رسالتك",
    contact_send_button: "إرسال الرسالة",
    contact_sending: "جاري الإرسال...",
    contact_message_sent: "تم إرسال الرسالة",
    contact_success_message: "شكراً. سنتواصل معك قريباً.",
    contact_location_title: "الموقع",
    contact_call_us_title: "اتصل بنا",
    contact_email_title: "البريد الإلكتروني",
    contact_follow_us_title: "تابعنا",
    contact_error: "فشل إرسال الرسالة. يرجى المحاولة مرة أخرى.",
    
    // Products Page
    products_breadcrumb: "المنتجات",
    products_heading: "منتجاتنا",
    products_loading: "جاري تحميل المنتجات...",
    products_error: "فشل تحميل المنتجات",
    products_no_data: "لا توجد منتجات متاحة",
    product_view_details: "عرض التفاصيل",
    product_live_demo: "عرض مباشر",
    
    // Work/Projects Page
    work_breadcrumb: "أعمالنا",
    work_heading: "معرض أعمالنا",
    work_description: "استكشف معرض المشاريع الناجحة التي قدمناها للعملاء في جميع أنحاء العالم",
    work_loading: "جاري تحميل المشاريع...",
    work_error: "فشل تحميل المشاريع",
    work_no_data: "لا توجد مشاريع متاحة",
    work_view_project: "عرض المشروع",
    
    // Service Details Page
    service_breadcrumb: "الخدمات",
    service_loading: "جاري تحميل تفاصيل الخدمة...",
    service_error: "الخدمة غير موجودة",
    service_technologies: "التقنيات التي نستخدمها",
    service_details: "تفاصيل الخدمة",
    service_back_to_services: "العودة إلى الخدمات",
    
    // Product Details Page
    product_breadcrumb: "المنتجات",
    product_loading: "جاري تحميل تفاصيل المنتج...",
    product_error: "المنتج غير موجود",
    product_details: "تفاصيل المنتج",
    product_images: "صور المنتج",
    product_back_to_products: "العودة إلى المنتجات",
    
    // Common/General
    loading: "جاري التحميل...",
    error: "خطأ",
    retry: "إعادة المحاولة",
    close: "إغلاق",
    open: "فتح",
    menu: "القائمة",
    read_more: "اقرأ المزيد",
    learn_more: "تعلم المزيد",
    view_all: "عرض الكل",
    back: "رجوع",
    next: "التالي",
    previous: "السابق",
    submit: "إرسال",
    cancel: "إلغاء",
    search: "بحث",
    filter: "تصفية",
    sort: "ترتيب",
    clear: "مسح",
    apply: "تطبيق",
    select_language: "اختر اللغة",
    open_menu: "فتح القائمة",
    close_menu: "إغلاق القائمة",
  },
};

import { useMemo } from "react";

export function useTranslation(language: "en" | "ar") {
  return useMemo(
    () => ({
      t: (key: TranslationKey): string => {
        return translations[language][key] || translations.en[key] || key;
      },
      language,
    }),
    [language]
  );
}

import HeroSection from "../component/HeroSection";
import BusinessSection from "../component/BusinessSection";
import ServiceSection from "../component/ServiceSection";
import ProjectSection from "../component/ProjectSection";
import FaqSection from "../component/FaqSection";
import TestimonialsSection from "../component/TestimonialsSection";
import { constructMetadata, generateFaqSchema } from "@/lib/seo";

export const metadata = constructMetadata({
  title: "Tech Gear Solutions | Software & Web Development Company",
  description:
    "Empowering businesses with custom software, high-performance websites, mobile applications, and digital transformation solutions. Transform your digital presence with Tech Gear.",
  path: "/",
  keywords: [
    "Software Development Company",
    "Web Development Company",
    "Mobile App Development",
    "Custom Software Solutions",
    "Digital Agency Egypt",
  ],
});

const defaultFaqs = [
  {
    question: "What services do you offer?",
    answer:
      "We provide complete digital solutions, including web and mobile development, custom software, UI/UX design, SEO, digital marketing, and graphic design.",
  },
  {
    question: "How do you start a new project?",
    answer:
      "We start with a conversation about your goals, audience, and challenges. From there, we define the right scope, timeline, and next steps together.",
  },
  {
    question: "How long does a project take?",
    answer:
      "Every project is different, but we provide a clear delivery plan before work begins and keep you updated throughout each phase.",
  },
  {
    question: "Can you work with an existing website or application?",
    answer:
      "Yes. We can improve, redesign, extend, or maintain an existing website or application while preserving the parts that already work well.",
  },
];

export default function Home() {
  const faqSchema = generateFaqSchema(defaultFaqs);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <HeroSection />
      <BusinessSection />
      <ServiceSection />
      <ProjectSection />
      <TestimonialsSection />
      <FaqSection />
    </>
  );
}

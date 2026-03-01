import { useState, useEffect, useRef } from 'react'
import emailjs from '@emailjs/browser'
import {
  Phone, Mail, MapPin, Clock, Menu, X, ChevronLeft, ChevronRight,
  Star, Heart, Award, Cpu, ClipboardList, IndianRupee, Smile,
  Stethoscope, Sparkles, Baby, Siren, Wrench, Eye, ShieldCheck,
  Calendar, ChevronDown, ChevronUp, MessageCircle, Send
} from 'lucide-react'
import './App.css'

const CLINIC_NAME = "Dantantra"
const DOCTOR_NAME = "Dr. Rashmeet Kaur"
const DOCTOR_TITLE = "Prosthodontist & Implantologist"
const CLINIC_ADDRESS = "Kotha Road, Bhagta Bhai Ka, District - Bathinda, Punjab"
const CLINIC_PHONE = "+91 7743000367"
const CLINIC_PHONE_RAW = "917743000367"
const CLINIC_EMAIL = "info.dantantra@gmail.com"
const BASE = import.meta.env.BASE_URL
const PF: React.CSSProperties = { fontFamily: 'Poppins, sans-serif' }

interface Service { icon: React.ReactNode; title: string; description: string }
interface Testimonial { name: string; treatment: string; quote: string; rating: number }
interface FAQ { question: string; answer: string }

const services: Service[] = [
  { icon: <Wrench className="w-8 h-8" />, title: "Dental Implants", description: "Single, multiple, and All-on-4/All-on-6 full-arch implants using premium titanium and zirconia materials with 95%+ success rates." },
  { icon: <Stethoscope className="w-8 h-8" />, title: "Fixed & Removable Dentures", description: "Complete and partial dentures, implant-supported overdentures crafted for perfect fit and natural appearance." },
  { icon: <ShieldCheck className="w-8 h-8" />, title: "Crowns & Bridges", description: "Premium porcelain, zirconia, and metal-ceramic restorations to rebuild and protect damaged teeth." },
  { icon: <Heart className="w-8 h-8" />, title: "Root Canal Treatment", description: "Pain-free endodontic therapy using advanced techniques to save and preserve your natural teeth." },
  { icon: <Sparkles className="w-8 h-8" />, title: "Teeth Whitening", description: "Professional in-office and take-home whitening solutions for a brighter, more confident smile." },
  { icon: <Eye className="w-8 h-8" />, title: "Invisible Braces / Aligners", description: "Clear aligner therapy for discreet teeth straightening — no metal brackets, just results." },
  { icon: <Smile className="w-8 h-8" />, title: "Cosmetic Dentistry", description: "Veneers, smile makeovers, bonding, and gum contouring for the perfect aesthetic you desire." },
  { icon: <Baby className="w-8 h-8" />, title: "Pediatric Dentistry", description: "Gentle, child-friendly dental care in a warm, fun environment that puts kids at ease." },
  { icon: <Siren className="w-8 h-8" />, title: "Emergency Dental Care", description: "Immediate relief for toothaches, knocked-out teeth, broken teeth, and dental trauma." },
]

const treatmentCategories = [
  { title: "General Dentistry", items: ["Dental Checkups & Cleanings", "Oral Cancer Screenings", "Fluoride Treatments", "Dental Sealants", "Oral Hygiene Education"] },
  { title: "Restorative Dentistry", items: ["Dental Fillings (Composite/Ceramic)", "Crowns & Bridges", "Full & Partial Dentures", "Root Canal Therapy", "Tooth Bonding & Repair"] },
  { title: "Cosmetic Dentistry", items: ["Professional Teeth Whitening", "Porcelain Veneers", "Invisalign & Clear Aligners", "Gum Contouring", "Complete Smile Makeovers"] },
  { title: "Oral Surgery & Extractions", items: ["Wisdom Teeth Removal", "Simple & Surgical Extractions", "Dental Implants (Single/All-on-4)", "Bone Grafting", "TMJ Disorder Treatment"] },
  { title: "Pediatric Dentistry", items: ["Child-Friendly Checkups", "Baby Tooth Extractions", "Early Orthodontic Evaluations", "Habit Counseling", "Preventive Sealants for Kids"] },
  { title: "Emergency Dental Care", items: ["Toothache Pain Relief", "Knocked-Out Tooth Treatment", "Broken Tooth Repair", "Abscess Drainage", "Same-Day Emergency Visits"] },
]

const testimonials: Testimonial[] = [
  { name: "Harpreet Singh", treatment: "Dental Implants", quote: "Dr. Rashmeet Kaur gave me the confidence to smile again. The implant procedure was painless and the results are phenomenal. Highly recommend Dantantra!", rating: 5 },
  { name: "Simran Kaur", treatment: "Root Canal Treatment", quote: "I was terrified of RCT but Dr. Rashmeet made it completely painless. The clinic is so clean and modern. Best dental experience I have ever had!", rating: 5 },
  { name: "Rajinder Sharma", treatment: "Complete Dentures", quote: "After years of struggling with ill-fitting dentures, Dantantra gave me perfectly crafted ones. I can eat and speak normally again. Thank you, Doctor!", rating: 5 },
  { name: "Manpreet Kaur", treatment: "Teeth Whitening", quote: "Amazing results from just one session! My teeth are several shades brighter. The staff is friendly and professional. Will definitely come back.", rating: 5 },
  { name: "Gurpreet Singh", treatment: "Invisible Braces", quote: "Got clear aligners from Dantantra and nobody even noticed I was wearing them! My teeth are perfectly straight now. Excellent treatment!", rating: 5 },
]

const faqs: FAQ[] = [
  { question: "Are dental implants painful?", answer: "Modern dental implants are placed under local anesthesia, making the procedure virtually painless. Most patients report less discomfort than a tooth extraction. Post-procedure, any mild soreness is easily managed with prescribed medication." },
  { question: "How long do dental implants last?", answer: "With proper care and regular dental checkups, dental implants can last 20-25 years or even a lifetime. They are the most durable and long-lasting tooth replacement solution available today." },
  { question: "What is the cost of dental implants?", answer: "The cost varies depending on the type of implant, material used, and complexity of the case. We offer competitive pricing and flexible payment options. Please visit us for a free consultation and personalized quote." },
  { question: "How many visits are needed for a dental implant?", answer: "Typically, the implant process requires 2-3 visits over 3-6 months. The first visit is for implant placement, followed by a healing period, and then the final crown placement. Some cases may qualify for same-day implants." },
  { question: "Do you offer EMI / payment plans?", answer: "Yes! We understand dental care is an investment. We offer flexible EMI options and accept various payment methods to make quality dental treatment accessible and affordable for everyone." },
  { question: "Is the clinic open on weekends?", answer: "We are open Monday through Saturday, 10:00 AM to 7:00 PM. We are closed on Sundays. For emergencies, please call our number and we will try our best to accommodate you." },
]

const timeSlots = ["10:00 AM", "11:00 AM", "12:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM", "06:00 PM"]

const openingHours = [
  { day: "Monday", time: "10:00 AM - 7:00 PM" },
  { day: "Tuesday", time: "10:00 AM - 7:00 PM" },
  { day: "Wednesday", time: "10:00 AM - 7:00 PM" },
  { day: "Thursday", time: "10:00 AM - 7:00 PM" },
  { day: "Friday", time: "10:00 AM - 7:00 PM" },
  { day: "Saturday", time: "10:00 AM - 7:00 PM" },
  { day: "Sunday", time: "Closed" },
]

const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ')
}

function SectionHeading({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="text-center mb-12">
      <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4" style={PF}>{title}</h2>
      <div className="w-20 h-1 bg-amber-500 mx-auto mb-4 rounded-full" />
      {subtitle && <p className="text-gray-600 max-w-2xl mx-auto text-lg">{subtitle}</p>}
    </div>
  )
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1 justify-center">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className={cn("w-4 h-4", i < rating ? "fill-amber-400 text-amber-400" : "text-gray-300")} />
      ))}
    </div>
  )
}

function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  useEffect(() => {
    const h = () => setIsScrolled(window.scrollY > 50)
    window.addEventListener('scroll', h)
    return () => window.removeEventListener('scroll', h)
  }, [])
  const navLinks = [
    { label: "Home", href: "#home" },
    { label: "About", href: "#about" },
    { label: "Services", href: "#services" },
    { label: "Treatments", href: "#treatments" },
    { label: "Testimonials", href: "#testimonials" },
    { label: "Contact", href: "#contact" },
  ]
  return (
    <header className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
      isScrolled ? "bg-white shadow-lg py-2" : "bg-white/90 backdrop-blur-sm py-4"
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        <a href="#home" className="flex items-center gap-2">
                    <img src={BASE + 'logo.svg'} alt="Dantantra Logo" className="w-10 h-10" />
                    <span className="font-bold text-xl text-teal-800" style={PF}>{CLINIC_NAME}</span>
        </a>
        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map(l => (
            <a key={l.href} href={l.href} className="text-gray-700 hover:text-teal-700 font-medium transition-colors text-sm">{l.label}</a>
          ))}
          <a href="#book" className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-2.5 rounded-full font-semibold text-sm transition-all shadow-md hover:shadow-lg">
            Book Appointment
          </a>
        </nav>
        <button onClick={() => setIsMobileOpen(!isMobileOpen)} className="lg:hidden text-gray-700 p-2" aria-label="Toggle menu">
          {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>
      {isMobileOpen && (
        <div className="lg:hidden bg-white border-t shadow-lg">
          <nav className="flex flex-col p-4 gap-3">
            {navLinks.map(l => (
              <a key={l.href} href={l.href} onClick={() => setIsMobileOpen(false)}
                className="text-gray-700 hover:text-teal-700 font-medium py-2 px-4 rounded-lg hover:bg-teal-50 transition-colors">
                {l.label}
              </a>
            ))}
            <a href="#book" onClick={() => setIsMobileOpen(false)}
              className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-full font-semibold text-center transition-all mt-2">
              Book Appointment
            </a>
          </nav>
        </div>
      )}
    </header>
  )
}

function Hero() {
  return (
    <section id="home" className="relative min-h-screen flex items-center pt-20">
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${BASE}images/hero-dental.jpg)` }}>
        <div className="absolute inset-0 bg-gradient-to-r from-teal-900/90 via-teal-800/80 to-teal-700/60" />
      </div>
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-20">
        <div className="max-w-2xl">
          <p className="text-amber-400 font-semibold text-lg mb-3 tracking-wide">Rooted in Care. Crafted for Confidence.</p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight" style={PF}>
            Advanced Dental Implant &amp; Prosthodontic Solutions
          </h1>
          <p className="text-teal-100 text-lg md:text-xl mb-8 leading-relaxed">
            Personalized care to restore your smile with precision, expertise, and compassion at {CLINIC_NAME}, Bathinda.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a href="#book" className="bg-amber-500 hover:bg-amber-600 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all shadow-lg hover:shadow-xl text-center">
              Book Appointment
            </a>
            <a href="#services" className="border-2 border-white/50 hover:border-white text-white px-8 py-4 rounded-full font-semibold text-lg transition-all hover:bg-white/10 text-center">
              Explore Services
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

function About() {
  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <img
              src={BASE + 'images/about-doctor.jpg'}
              alt={"" + DOCTOR_NAME + " - Prosthodontist and Implantologist"}
              className="rounded-2xl shadow-xl w-full object-cover"
              style={{ height: '480px' }}
              onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/600x700/0D7377/ffffff?text=Dr.+Rashmeet+Kaur' }}
            />
            <div className="absolute -bottom-6 -right-6 bg-amber-500 text-white p-6 rounded-2xl shadow-lg hidden md:block">
              <p className="text-3xl font-bold">10+</p>
              <p className="text-sm">Years of Excellence</p>
            </div>
          </div>
          <div>
            <p className="text-amber-500 font-semibold text-sm tracking-wider uppercase mb-2">About Us</p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4" style={PF}>Meet {DOCTOR_NAME}</h2>
            <p className="text-teal-700 font-semibold text-lg mb-4">{DOCTOR_TITLE}</p>
            <p className="text-gray-600 mb-6 leading-relaxed">
              At {CLINIC_NAME}, we pride ourselves on delivering exceptional, personalized dental care to restore your smile with precision and expertise. {DOCTOR_NAME} specializes in state-of-the-art dental implants and prosthodontic solutions, ensuring natural-looking, long-lasting results for patients of all ages.
            </p>
            <p className="text-gray-600 mb-8 leading-relaxed">
              With over a decade of experience and advanced training in implantology and prosthodontics, {DOCTOR_NAME} combines cutting-edge technology with a compassionate approach to make every dental visit comfortable and stress-free.
            </p>
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="flex items-center gap-3 bg-teal-50 p-4 rounded-xl">
                <Award className="w-6 h-6 text-teal-700 flex-shrink-0" />
                <span className="text-gray-700 font-medium text-sm">BDS, MDS (Prosthodontics)</span>
              </div>
              <div className="flex items-center gap-3 bg-teal-50 p-4 rounded-xl">
                <Wrench className="w-6 h-6 text-teal-700 flex-shrink-0" />
                <span className="text-gray-700 font-medium text-sm">Implant Specialist</span>
              </div>
              <div className="flex items-center gap-3 bg-teal-50 p-4 rounded-xl">
                <Clock className="w-6 h-6 text-teal-700 flex-shrink-0" />
                <span className="text-gray-700 font-medium text-sm">10+ Years Experience</span>
              </div>
              <div className="flex items-center gap-3 bg-teal-50 p-4 rounded-xl">
                <Heart className="w-6 h-6 text-teal-700 flex-shrink-0" />
                <span className="text-gray-700 font-medium text-sm">Patient-First Approach</span>
              </div>
            </div>
            <blockquote className="border-l-4 border-amber-500 pl-4 italic text-gray-600">
              &ldquo;Your smile is our signature. Every patient deserves personalized care and the confidence that comes with a healthy, beautiful smile.&rdquo;
            </blockquote>
          </div>
        </div>
      </div>
    </section>
  )
}

function Services() {
  return (
    <section id="services" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <SectionHeading title="Our Specializations" subtitle="Comprehensive dental solutions tailored to your unique needs, delivered with precision and care." />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((s, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 group border border-gray-100 hover:border-teal-200">
              <div className="w-14 h-14 bg-teal-50 group-hover:bg-teal-700 rounded-xl flex items-center justify-center mb-4 transition-colors duration-300">
                <div className="text-teal-700 group-hover:text-white transition-colors duration-300">{s.icon}</div>
              </div>
              <h3 className="font-semibold text-lg text-gray-800 mb-2" style={PF}>{s.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{s.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function WhatWeTreat() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)
  return (
    <section id="treatments" className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <SectionHeading title="What We Treat" subtitle="From routine checkups to complex implant surgeries, we provide comprehensive care for every dental need." />
        <div className="space-y-3">
          {treatmentCategories.map((cat, index) => (
            <div key={index} className="border border-gray-200 rounded-xl overflow-hidden">
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-5 bg-white hover:bg-gray-50 transition-colors"
              >
                <span className="font-semibold text-gray-800" style={PF}>{cat.title}</span>
                {openIndex === index ? <ChevronUp className="w-5 h-5 text-teal-700" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
              </button>
              {openIndex === index && (
                <div className="px-5 pb-5">
                  <ul className="grid sm:grid-cols-2 gap-2">
                    {cat.items.map((item, i) => (
                      <li key={i} className="flex items-center gap-2 text-gray-600 text-sm">
                        <div className="w-1.5 h-1.5 bg-amber-500 rounded-full flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function WhyChooseUs() {
  const features = [
    { icon: <Cpu className="w-7 h-7" />, title: "State-of-the-Art Technology", desc: "Latest digital imaging and treatment equipment" },
    { icon: <Award className="w-7 h-7" />, title: "Experienced Specialist", desc: "MDS qualified prosthodontist & implantologist" },
    { icon: <Heart className="w-7 h-7" />, title: "Pain-Free Procedures", desc: "Advanced anesthesia for comfortable treatment" },
    { icon: <ClipboardList className="w-7 h-7" />, title: "Personalized Plans", desc: "Customized treatment for every patient" },
    { icon: <IndianRupee className="w-7 h-7" />, title: "Affordable Pricing", desc: "Quality care with flexible EMI options" },
    { icon: <Smile className="w-7 h-7" />, title: "Warm Environment", desc: "Friendly staff and comfortable clinic" },
  ]
  return (
    <section className="py-20 bg-teal-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4" style={PF}>Why Choose {CLINIC_NAME}?</h2>
          <div className="w-20 h-1 bg-amber-500 mx-auto mb-4 rounded-full" />
          <p className="text-teal-200 max-w-2xl mx-auto text-lg">We combine expertise, technology, and compassion to deliver exceptional dental care.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <div key={i} className="bg-teal-700/50 backdrop-blur-sm rounded-2xl p-6 text-center hover:bg-teal-700 transition-colors border border-teal-600/30">
              <div className="w-14 h-14 bg-amber-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                <div className="text-amber-400">{f.icon}</div>
              </div>
              <h3 className="font-semibold text-white mb-2" style={PF}>{f.title}</h3>
              <p className="text-teal-200 text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Testimonials() {
  const [current, setCurrent] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const next = () => setCurrent((p) => (p + 1) % testimonials.length)
  const prev = () => setCurrent((p) => (p - 1 + testimonials.length) % testimonials.length)
  useEffect(() => {
    const iv = setInterval(next, 5000)
    return () => clearInterval(iv)
  }, [])
  return (
    <section id="testimonials" className="py-20 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <SectionHeading title="What Our Patients Say" subtitle="Real stories from real patients who trust us with their smiles." />
        <div className="relative" ref={containerRef}>
          <div className="bg-white rounded-2xl p-8 md:p-12 shadow-lg text-center border border-gray-100">
            <StarRating rating={testimonials[current].rating} />
            <blockquote className="mt-6 mb-6">
              <p className="text-gray-700 text-lg leading-relaxed italic">
                &ldquo;{testimonials[current].quote}&rdquo;
              </p>
            </blockquote>
            <p className="font-semibold text-gray-800 text-lg" style={PF}>{testimonials[current].name}</p>
            <p className="text-amber-600 text-sm font-medium">{testimonials[current].treatment}</p>
          </div>
          <div className="flex items-center justify-center gap-4 mt-6">
            <button onClick={prev} className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-teal-50 hover:border-teal-300 transition-colors" aria-label="Previous testimonial">
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={cn("w-2.5 h-2.5 rounded-full transition-colors", i === current ? "bg-teal-700" : "bg-gray-300")}
                  aria-label={"Go to testimonial " + (i + 1)}
                />
              ))}
            </div>
            <button onClick={next} className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-teal-50 hover:border-teal-300 transition-colors" aria-label="Next testimonial">
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

function CTABanner() {
  return (
    <section className="py-16 bg-gradient-to-r from-teal-800 to-teal-700">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-4" style={PF}>
          Book Your Pain-Free Dental Consultation Today!
        </h2>
        <p className="text-teal-200 mb-8 text-lg">
          Take the first step towards your perfect smile. Schedule your appointment now.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="#book" className="bg-amber-500 hover:bg-amber-600 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all shadow-lg hover:shadow-xl">
            Reserve Your Slot Now
          </a>
          <a href={"tel:" + CLINIC_PHONE} className="border-2 border-white/50 hover:border-white text-white px-8 py-4 rounded-full font-semibold text-lg transition-all hover:bg-white/10 flex items-center justify-center gap-2">
            <Phone className="w-5 h-5" />Call Now
          </a>
        </div>
      </div>
    </section>
  )
}

function BookAppointment() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = useState('')
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', treatment: '', message: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const getDaysInMonth = (date: Date) => {
    const y = date.getFullYear()
    const m = date.getMonth()
    const firstDay = new Date(y, m, 1)
    const daysInMonth = new Date(y, m + 1, 0).getDate()
    const startingDay = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1
    const days: (Date | null)[] = []
    for (let i = 0; i < startingDay; i++) days.push(null)
    for (let i = 1; i <= daysInMonth; i++) days.push(new Date(y, m, i))
    return days
  }

  const isDateDisabled = (d: Date) => d < today || d.getDay() === 0
  const isSameDay = (a: Date, b: Date) => a.getDate() === b.getDate() && a.getMonth() === b.getMonth() && a.getFullYear() === b.getFullYear()
  const formatDate = (d: Date) => d.getDate() + " " + monthNames[d.getMonth()] + " " + d.getFullYear()

  const goToPrevMonth = () => {
    const p = new Date(currentMonth)
    p.setMonth(p.getMonth() - 1)
    const now = new Date()
    if (p.getFullYear() > now.getFullYear() || (p.getFullYear() === now.getFullYear() && p.getMonth() >= now.getMonth())) {
      setCurrentMonth(p)
    }
  }
  const goToNextMonth = () => {
    const n = new Date(currentMonth)
    n.setMonth(n.getMonth() + 1)
    setCurrentMonth(n)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedDate || !selectedTime) return
    setIsSubmitting(true)
    setSubmitStatus('idle')
    const params = {
      patient_name: formData.name,
      patient_phone: formData.phone,
      patient_email: formData.email,
      appointment_date: formatDate(selectedDate),
      appointment_time: selectedTime,
      treatment: formData.treatment,
      message: formData.message || 'No additional message',
      clinic_name: CLINIC_NAME,
      clinic_phone: CLINIC_PHONE,
    }
    try {
      const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID || 'demo_service'
      const clinicTemplateId = import.meta.env.VITE_EMAILJS_CLINIC_TEMPLATE_ID || 'demo_template'
      const patientTemplateId = import.meta.env.VITE_EMAILJS_PATIENT_TEMPLATE_ID || 'demo_template'
      const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'demo_key'
      await emailjs.send(serviceId, clinicTemplateId, params, publicKey)
      try {
        await emailjs.send(serviceId, patientTemplateId, params, publicKey)
      } catch {
        // patient email is secondary
      }
      setSubmitStatus('success')
      setFormData({ name: '', phone: '', email: '', treatment: '', message: '' })
      setSelectedDate(null)
      setSelectedTime('')
    } catch {
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const days = getDaysInMonth(currentMonth)

  const getDateButtonClass = (day: Date) => {
    const sel = selectedDate && isSameDay(day, selectedDate)
    const dis = isDateDisabled(day)
    const sun = day.getDay() === 0
    if (sel) return "py-2.5 rounded-lg text-sm font-medium transition-all bg-teal-700 text-white shadow-md"
    if (dis && sun) return "py-2.5 rounded-lg text-sm font-medium transition-all text-red-300 cursor-not-allowed"
    if (dis) return "py-2.5 rounded-lg text-sm font-medium transition-all text-gray-300 cursor-not-allowed"
    return "py-2.5 rounded-lg text-sm font-medium transition-all text-gray-700 hover:bg-teal-100"
  }

  return (
    <section id="book" className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <SectionHeading title="Book Your Appointment" subtitle="Select a date and time that works for you. We will confirm your appointment shortly." />
        {submitStatus === 'success' && (
          <div className="mb-8 bg-green-50 border border-green-200 text-green-800 px-6 py-4 rounded-xl text-center">
            <p className="font-semibold">Appointment request sent successfully!</p>
            <p className="text-sm mt-1">We will confirm your booking shortly. You can also call us at {CLINIC_PHONE}.</p>
          </div>
        )}
        {submitStatus === 'error' && (
          <div className="mb-8 bg-red-50 border border-red-200 text-red-800 px-6 py-4 rounded-xl text-center">
            <p className="font-semibold">Something went wrong. Please try again or call us directly.</p>
            <p className="text-sm mt-1">Phone: {CLINIC_PHONE}</p>
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <button type="button" onClick={goToPrevMonth} className="p-2 hover:bg-gray-200 rounded-lg transition-colors" aria-label="Previous month">
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <h3 className="font-semibold text-lg text-gray-800" style={PF}>
                  {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                </h3>
                <button type="button" onClick={goToNextMonth} className="p-2 hover:bg-gray-200 rounded-lg transition-colors" aria-label="Next month">
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
              <div className="grid grid-cols-7 gap-1 mb-2">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => (
                  <div key={d} className="text-center text-xs font-semibold text-gray-500 py-2">{d}</div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {days.map((day, i) => {
                  if (!day) return <div key={"e" + i} />
                  return (
                    <button
                      key={"d" + i}
                      type="button"
                      disabled={isDateDisabled(day)}
                      onClick={() => { setSelectedDate(day); setSelectedTime('') }}
                      className={getDateButtonClass(day)}
                    >
                      {day.getDate()}
                    </button>
                  )
                })}
              </div>
              {selectedDate && (
                <div className="mt-6">
                  <p className="font-medium text-gray-700 mb-3">Available slots for {formatDate(selectedDate)}:</p>
                  <div className="grid grid-cols-4 gap-2">
                    {timeSlots.map(slot => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setSelectedTime(slot)}
                        className={cn(
                          "py-2 px-2 rounded-lg text-xs font-medium transition-all",
                          selectedTime === slot
                            ? "bg-amber-500 text-white shadow-md"
                            : "bg-white border border-gray-200 text-gray-700 hover:border-amber-400"
                        )}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all" placeholder="Your full name" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                <input type="tel" required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all" placeholder="+91 XXXXX XXXXX" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                <input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all" placeholder="you@example.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Treatment Needed *</label>
                <select required value={formData.treatment} onChange={e => setFormData({...formData, treatment: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all bg-white">
                  <option value="">Select a treatment</option>
                  <option value="Dental Implant">Dental Implant</option>
                  <option value="Root Canal Treatment">Root Canal Treatment</option>
                  <option value="Crowns and Bridges">Crowns and Bridges</option>
                  <option value="Dentures">Dentures (Fixed/Removable)</option>
                  <option value="Teeth Whitening">Teeth Whitening</option>
                  <option value="Invisible Braces">Invisible Braces / Aligners</option>
                  <option value="Cosmetic Dentistry">Cosmetic Dentistry</option>
                  <option value="Pediatric Dentistry">Pediatric Dentistry</option>
                  <option value="Emergency">Emergency Dental Care</option>
                  <option value="General Checkup">General Checkup</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Additional Message</label>
                <textarea value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all resize-none" placeholder="Any specific concerns or requests..." />
              </div>
              {selectedDate && selectedTime && (
                <div className="bg-teal-50 border border-teal-200 p-4 rounded-xl">
                  <p className="text-teal-800 font-medium flex items-center gap-2">
                    <Calendar className="w-4 h-4" />Selected: {formatDate(selectedDate)} at {selectedTime}
                  </p>
                </div>
              )}
              <button
                type="submit"
                disabled={isSubmitting || !selectedDate || !selectedTime}
                className="w-full bg-amber-500 hover:bg-amber-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-4 rounded-xl font-semibold text-lg transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />Sending...</>
                ) : (
                  <><Send className="w-5 h-5" />Book Appointment</>
                )}
              </button>
              <p className="text-xs text-gray-500 text-center">By booking, you agree to receive appointment confirmation via email and phone.</p>
            </div>
          </div>
        </form>
      </div>
    </section>
  )
}

function Contact() {
  const [contactForm, setContactForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' })
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSending(true)
    try {
      const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID || 'demo_service'
      const templateId = import.meta.env.VITE_EMAILJS_CLINIC_TEMPLATE_ID || 'demo_template'
      const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'demo_key'
      await emailjs.send(serviceId, templateId,
        { patient_name: contactForm.name, patient_email: contactForm.email, patient_phone: contactForm.phone, subject: contactForm.subject, message: contactForm.message, type: 'Contact Form Inquiry' },
        publicKey)
      setSent(true)
      setContactForm({ name: '', email: '', phone: '', subject: '', message: '' })
    } catch {
      alert('Failed to send. Please call us directly at ' + CLINIC_PHONE)
    } finally {
      setSending(false)
    }
  }

  return (
    <section id="contact" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <SectionHeading title="Contact Us" subtitle="Get in touch with us for any queries. We are here to help!" />
        <div className="grid lg:grid-cols-2 gap-8">
          <div>
            <div className="bg-amber-500 rounded-2xl p-8 text-white mb-6">
              <h3 className="font-bold text-xl mb-6" style={PF}>{CLINIC_NAME} Dental Clinic</h3>
              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  <p className="text-sm">{CLINIC_ADDRESS}</p>
                </div>
                <div className="flex items-center gap-4">
                  <Phone className="w-5 h-5 flex-shrink-0" />
                  <a href={"tel:" + CLINIC_PHONE} className="hover:underline text-sm">{CLINIC_PHONE}</a>
                </div>
                <div className="flex items-center gap-4">
                  <Mail className="w-5 h-5 flex-shrink-0" />
                  <a href={"mailto:" + CLINIC_EMAIL} className="hover:underline text-sm">{CLINIC_EMAIL}</a>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-gray-200">
              <h3 className="font-semibold text-lg text-gray-800 mb-4 flex items-center gap-2" style={PF}>
                <Clock className="w-5 h-5 text-teal-700" />Opening Hours
              </h3>
              <div className="space-y-2">
                {openingHours.map(h => (
                  <div key={h.day} className={cn(
                    "flex justify-between py-2 px-3 rounded-lg text-sm",
                    h.time === 'Closed' ? "bg-red-50 text-red-600" : "bg-gray-50 text-gray-700"
                  )}>
                    <span className="font-medium">{h.day}</span>
                    <span>{h.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div>
            <div className="rounded-2xl overflow-hidden mb-6" style={{ height: '256px' }}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13764.263529782695!2d75.00218!3d30.41573!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39101a44db0acb65%3A0x2e1fd45c2a32124d!2sBhagta%20Bhai%20Ka!5e0!3m2!1sen!2sin!4v1234567890"
                width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy"
                referrerPolicy="no-referrer-when-downgrade" title="Dantantra Clinic Location"
              />
            </div>
            <div className="bg-white rounded-2xl p-6 border border-gray-200">
              <h3 className="font-semibold text-lg text-gray-800 mb-4" style={PF}>Send us a Message</h3>
              {sent ? (
                <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-6 rounded-xl text-center">
                  <p className="font-semibold">Message sent successfully!</p>
                  <p className="text-sm mt-1">We will get back to you soon.</p>
                  <button type="button" onClick={() => setSent(false)} className="mt-3 text-teal-700 underline text-sm">Send another message</button>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-3">
                  <input type="text" required value={contactForm.name} onChange={e => setContactForm({...contactForm, name: e.target.value})}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none text-sm" placeholder="Full Name *" />
                  <div className="grid grid-cols-2 gap-3">
                    <input type="email" required value={contactForm.email} onChange={e => setContactForm({...contactForm, email: e.target.value})}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none text-sm" placeholder="Email *" />
                    <input type="tel" required value={contactForm.phone} onChange={e => setContactForm({...contactForm, phone: e.target.value})}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none text-sm" placeholder="Phone *" />
                  </div>
                  <input type="text" value={contactForm.subject} onChange={e => setContactForm({...contactForm, subject: e.target.value})}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none text-sm" placeholder="Subject" />
                  <textarea required value={contactForm.message} onChange={e => setContactForm({...contactForm, message: e.target.value})} rows={3}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none text-sm resize-none" placeholder="Your message *" />
                  <button type="submit" disabled={sending}
                    className="w-full bg-teal-700 hover:bg-teal-800 text-white py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2">
                    {sending ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  return (
    <section className="py-20 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <SectionHeading title="Frequently Asked Questions" subtitle="Find answers to common questions about our treatments and clinic." />
        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <div key={index} className="border border-gray-200 rounded-xl overflow-hidden">
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-5 bg-white hover:bg-gray-50 transition-colors text-left"
              >
                <span className="font-medium text-gray-800 pr-4">{faq.question}</span>
                {openIndex === index ? <ChevronUp className="w-5 h-5 text-teal-700 flex-shrink-0" /> : <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />}
              </button>
              {openIndex === index && (
                <div className="px-5 pb-5">
                  <p className="text-gray-600 text-sm leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Footer() {
  const quickLinks = [
    { l: "Home", h: "#home" },
    { l: "About Us", h: "#about" },
    { l: "Services", h: "#services" },
    { l: "Book Appointment", h: "#book" },
    { l: "Contact Us", h: "#contact" },
  ]
  return (
    <footer className="bg-gray-900 text-gray-300 pt-16 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
                            <img src={BASE + 'logo.svg'} alt="Dantantra Logo" className="w-10 h-10" />
                            <span className="font-bold text-xl text-white" style={PF}>{CLINIC_NAME}</span>
            </div>
            <p className="text-sm leading-relaxed mb-4">
              {CLINIC_NAME} provides expert dental care in Bathinda. We offer complete treatments from routine checkups to implants and smile makeovers using advanced technology in a comfortable environment.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4" style={PF}>Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map(x => (
                <li key={x.h}><a href={x.h} className="text-sm hover:text-amber-400 transition-colors">{x.l}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4" style={PF}>Our Services</h4>
            <ul className="space-y-2">
              {services.slice(0, 6).map((s, i) => (
                <li key={i}><a href="#services" className="text-sm hover:text-amber-400 transition-colors">{s.title}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4" style={PF}>Opening Hours</h4>
            <ul className="space-y-2">
              {openingHours.map(h => (
                <li key={h.day} className="flex justify-between text-sm">
                  <span>{h.day}</span>
                  <span className={h.time === 'Closed' ? 'text-red-400' : 'text-amber-400'}>{h.time}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} {CLINIC_NAME} Dental Clinic. All Rights Reserved.
          </p>
          <div className="flex items-center gap-4">
            <a href={"tel:" + CLINIC_PHONE} className="text-gray-400 hover:text-amber-400 transition-colors"><Phone className="w-5 h-5" /></a>
            <a href={"mailto:" + CLINIC_EMAIL} className="text-gray-400 hover:text-amber-400 transition-colors"><Mail className="w-5 h-5" /></a>
          </div>
        </div>
      </div>
    </footer>
  )
}

function WhatsAppButton() {
  const waUrl = "https://wa.me/" + CLINIC_PHONE_RAW + "?text=Hi%20Dr.%20Rashmeet,%20I%20would%20like%20to%20book%20an%20appointment%20at%20Dantantra."
  return (
    <a
      href={waUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-20 right-6 z-50 bg-green-500 hover:bg-green-600 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all animate-bounce lg:bottom-6"
      aria-label="Chat on WhatsApp"
      style={{ animationDuration: '2s' }}
    >
      <MessageCircle className="w-7 h-7" />
    </a>
  )
}

function MobileBookButton() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 p-3 lg:hidden shadow-lg">
      <a href="#book" className="block bg-amber-500 hover:bg-amber-600 text-white py-3 rounded-xl font-semibold text-center transition-all">
        Book Appointment
      </a>
    </div>
  )
}

function App() {
  return (
    <div style={{ fontFamily: 'Inter, sans-serif' }}>
      <Navbar />
      <Hero />
      <About />
      <Services />
      <WhatWeTreat />
      <WhyChooseUs />
      <Testimonials />
      <CTABanner />
      <BookAppointment />
      <Contact />
      <FAQSection />
      <Footer />
      <WhatsAppButton />
      <MobileBookButton />
    </div>
  )
}

export default App

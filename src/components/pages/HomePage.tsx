import { ImageWithFallback } from '../figma/ImageWithFallback';
import { ArrowRight, Award, Users, CheckCircle } from 'lucide-react';

interface HomePageProps {
  onNavigate: (page: string) => void;
}

export function HomePage({ onNavigate }: HomePageProps) {
  const projects = [
    {
      id: 1,
      title: 'Modern Living Room',
      category: 'Residential',
      image: 'https://images.unsplash.com/photo-1667584523543-d1d9cc828a15?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBsaXZpbmclMjByb29tJTIwaW50ZXJpb3J8ZW58MXx8fHwxNzU5OTAzNjYxfDA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      id: 2,
      title: 'Executive Office',
      category: 'Commercial',
      image: 'https://images.unsplash.com/photo-1641998148499-cb6b55a3c0d3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBvZmZpY2UlMjBpbnRlcmlvcnxlbnwxfHx8fDE3NTk5OTM4OTB8MA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      id: 3,
      title: 'Elegant Bedroom',
      category: 'Residential',
      image: 'https://images.unsplash.com/photo-1704428382616-d8c65fdd76f4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVnYW50JTIwYmVkcm9vbSUyMGRlc2lnbnxlbnwxfHx8fDE3NTk5MjIwMTN8MA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      id: 4,
      title: 'Contemporary Kitchen',
      category: 'Residential',
      image: 'https://images.unsplash.com/photo-1641823911769-c55f23c25143?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBraXRjaGVuJTIwaW50ZXJpb3J8ZW58MXx8fHwxNzU5OTU2ODExfDA&ixlib=rb-4.1.0&q=80&w=1080',
    },
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Homeowner',
      text: 'HDA Interior transformed our house into a dream home. Their attention to detail and creativity exceeded our expectations.',
    },
    {
      name: 'Michael Chen',
      role: 'Business Owner',
      text: 'Professional, efficient, and incredibly talented. They delivered our office renovation on time and within budget.',
    },
    {
      name: 'Diana Putri',
      role: 'Restaurant Owner',
      text: 'The team created a warm, inviting atmosphere that our customers love. Highly recommend their services!',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[600px] bg-gray-900">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1667584523543-d1d9cc828a15?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBsaXZpbmclMjByb29tJTIwaW50ZXJpb3J8ZW58MXx8fHwxNzU5OTAzNjYxfDA&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Modern Living Room"
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white px-4">
            <h1 className="text-5xl md:text-6xl mb-6 text-white">Transform Your Space</h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-200 max-w-2xl mx-auto">
              Elevating homes and offices with timeless design and expert craftsmanship
            </p>
            <button
              onClick={() => onNavigate('contact')}
              className="px-8 py-4 bg-[#E89B7C] text-white rounded-lg hover:bg-[#D8845F] transition-colors inline-flex items-center gap-2"
            >
              Contact Us
              <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </section>

      {/* Company Profile */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h2 className="text-[#5BA8A8] mb-4">About HDA Interior</h2>
          <p className="text-gray-600 max-w-3xl mx-auto">
            We are a premier interior design and contracting company specializing in creating beautiful, 
            functional spaces that reflect your unique style and needs. With years of experience and a 
            passion for excellence, we bring your vision to life.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-[#5BA8A8] rounded-full flex items-center justify-center mx-auto mb-4">
              <Award size={32} className="text-white" />
            </div>
            <h3 className="mb-2">15+ Years</h3>
            <p className="text-gray-600">Of Excellence</p>
          </div>
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-[#E89B7C] rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={32} className="text-white" />
            </div>
            <h3 className="mb-2">200+ Projects</h3>
            <p className="text-gray-600">Successfully Completed</p>
          </div>
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-[#9B7CB5] rounded-full flex items-center justify-center mx-auto mb-4">
              <Users size={32} className="text-white" />
            </div>
            <h3 className="mb-2">150+ Clients</h3>
            <p className="text-gray-600">Happy & Satisfied</p>
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-[#5BA8A8] mb-4">Featured Projects</h2>
            <p className="text-gray-600">
              Explore our latest interior design masterpieces
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {projects.map((project) => (
              <div
                key={project.id}
                className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow cursor-pointer"
                onClick={() => onNavigate(`project-${project.id}`)}
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <ImageWithFallback
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="p-4">
                  <span className="text-sm text-[#5BA8A8]">{project.category}</span>
                  <h3 className="mt-1">{project.title}</h3>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <button
              onClick={() => onNavigate('portfolio')}
              className="px-6 py-3 border-2 border-[#5BA8A8] text-[#5BA8A8] rounded-lg hover:bg-[#5BA8A8] hover:text-white transition-colors"
            >
              View All Projects
            </button>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h2 className="text-[#5BA8A8] mb-4">Our Services</h2>
          <p className="text-gray-600">
            Comprehensive interior design solutions for every need
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            'Residential Design',
            'Office Design',
            'Renovation',
            'Consultation',
          ].map((service, index) => (
            <div key={index} className="text-center p-6 border border-gray-200 rounded-lg hover:border-[#5BA8A8] transition-colors">
              <h4 className="mb-2">{service}</h4>
              <p className="text-gray-600 mb-4">
                Expert solutions tailored to your needs
              </p>
              <button
                onClick={() => onNavigate('services')}
                className="text-[#5BA8A8] hover:underline"
              >
                Learn More
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-[#2D3748] text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-[#5BA8A8] mb-4">Client Testimonials</h2>
            <p className="text-gray-300">
              What our clients say about us
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gray-700 p-6 rounded-lg">
                <p className="text-gray-300 mb-4 italic">"{testimonial.text}"</p>
                <div>
                  <h4 className="text-white">{testimonial.name}</h4>
                  <p className="text-gray-400">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

import { ImageWithFallback } from '../figma/ImageWithFallback';
import { Home, Building2, Wrench, MessageSquare } from 'lucide-react';

export function ServicesPage() {
  const services = [
    {
      icon: Home,
      title: 'Residential Interior Design',
      description: 'Transform your house into a dream home with our personalized residential design services. We create spaces that reflect your lifestyle and personality.',
      features: [
        'Living room & bedroom design',
        'Kitchen & bathroom renovation',
        'Space planning & optimization',
        'Custom furniture design',
      ],
      image: 'https://images.unsplash.com/photo-1667584523543-d1d9cc828a15?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBsaXZpbmclMjByb29tJTIwaW50ZXJpb3J8ZW58MXx8fHwxNzU5OTAzNjYxfDA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      icon: Building2,
      title: 'Office & Commercial Design',
      description: 'Create productive and inspiring workspaces that enhance employee well-being and reflect your brand identity.',
      features: [
        'Office layout & design',
        'Meeting room solutions',
        'Reception area design',
        'Retail space planning',
      ],
      image: 'https://images.unsplash.com/photo-1641998148499-cb6b55a3c0d3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBvZmZpY2UlMjBpbnRlcmlvcnxlbnwxfHx8fDE3NTk5OTM4OTB8MA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      icon: Wrench,
      title: 'Renovation & Remodeling',
      description: 'Breathe new life into your existing space with our comprehensive renovation services. From minor updates to complete overhauls.',
      features: [
        'Full home renovation',
        'Kitchen & bathroom remodeling',
        'Structural modifications',
        'Electrical & plumbing upgrades',
      ],
      image: 'https://images.unsplash.com/photo-1641823911769-c55f23c25143?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBraXRjaGVuJTIwaW50ZXJpb3J8ZW58MXx8fHwxNzU5OTU2ODExfDA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      icon: MessageSquare,
      title: 'Design Consultation',
      description: 'Expert guidance for your design projects. Get professional advice on layouts, materials, colors, and more.',
      features: [
        'Initial design consultation',
        'Material & color selection',
        'Budget planning',
        'Project timeline development',
      ],
      image: 'https://images.unsplash.com/photo-1587522384446-64daf3e2689a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsaXN0JTIwd29ya3NwYWNlfGVufDF8fHx8MTc1OTk2MjM5MHww&ixlib=rb-4.1.0&q=80&w=1080',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[400px] bg-gray-900">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1587522384446-64daf3e2689a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsaXN0JTIwd29ya3NwYWNlfGVufDF8fHx8MTc1OTk2MjM5MHww&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Our Services"
          className="w-full h-full object-cover opacity-50"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white px-4">
            <h1 className="text-5xl mb-4 text-white">Our Services</h1>
            <p className="text-xl text-gray-200 max-w-2xl mx-auto">
              Comprehensive interior design solutions tailored to your unique needs and vision
            </p>
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-[#5BA8A8] mb-4">What We Offer</h2>
          <p className="text-gray-600">
            At HDA Interior, we provide end-to-end interior design and contracting services. 
            From initial concept to final execution, our team of experts ensures every detail is 
            perfect, delivering spaces that are both beautiful and functional.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="space-y-16">
          {services.map((service, index) => {
            const Icon = service.icon;
            const colors = ['#5BA8A8', '#E89B7C', '#9B7CB5', '#82C4A1'];
            return (
              <div
                key={index}
                className={`grid grid-cols-1 lg:grid-cols-2 gap-8 items-center ${
                  index % 2 === 1 ? 'lg:flex-row-reverse' : ''
                }`}
              >
                <div className={index % 2 === 1 ? 'lg:order-2' : ''}>
                  <div className="w-16 h-16 rounded-lg flex items-center justify-center mb-4" style={{backgroundColor: colors[index % colors.length]}}>
                    <Icon size={32} className="text-white" />
                  </div>
                  <h3 className="text-[#2D3748] mb-4">{service.title}</h3>
                  <p className="text-gray-600 mb-6">{service.description}</p>
                  <ul className="space-y-2 mb-6">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-gray-600">
                        <div className="w-1.5 h-1.5 bg-[#5BA8A8] rounded-full" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <button className="px-6 py-3 bg-[#E89B7C] text-white rounded-lg hover:bg-[#D8845F] transition-colors">
                    Learn More
                  </button>
                </div>
                <div className={index % 2 === 1 ? 'lg:order-1' : ''}>
                  <ImageWithFallback
                    src={service.image}
                    alt={service.title}
                    className="w-full h-[400px] object-cover rounded-lg shadow-lg"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-[#5BA8A8] to-[#4A9090] py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-white mb-4">Ready to Transform Your Space?</h2>
          <p className="text-white/90 mb-8">
            Let's discuss your project and bring your vision to life. Our team is ready to help.
          </p>
          <button className="px-8 py-4 bg-white text-[#5BA8A8] rounded-lg hover:bg-gray-100 transition-colors">
            Get a Free Consultation
          </button>
        </div>
      </section>
    </div>
  );
}

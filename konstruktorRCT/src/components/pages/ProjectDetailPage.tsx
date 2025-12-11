import { ImageWithFallback } from '../figma/ImageWithFallback';
import { Calendar, MapPin, User, Clock, ChevronLeft, ChevronRight } from 'lucide-react';

interface ProjectDetailPageProps {
  projectId: string;
  onNavigate: (page: string) => void;
}

export function ProjectDetailPage({ projectId, onNavigate }: ProjectDetailPageProps) {
  const projects: Record<string, any> = {
    'project-1': {
      title: 'Modern Living Room',
      location: 'Jakarta Selatan',
      client: 'Mr. & Mrs. Anderson',
      date: 'January 2025',
      duration: '3 months',
      category: 'Residential',
      style: 'Contemporary Minimalist',
      description: 'A complete transformation of a dated living space into a modern, elegant retreat. The design emphasizes clean lines, neutral colors, and natural materials to create a serene yet sophisticated atmosphere.',
      concept: 'The design concept revolves around creating an open, airy space that maximizes natural light while maintaining a sense of intimacy. We incorporated custom-built storage solutions to maintain the minimalist aesthetic while ensuring functionality.',
      materials: [
        'Italian marble flooring',
        'Oak wood paneling',
        'Custom-made modular sofa',
        'Designer lighting fixtures',
        'Smart home integration',
      ],
      images: [
        'https://images.unsplash.com/photo-1667584523543-d1d9cc828a15?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBsaXZpbmclMjByb29tJTIwaW50ZXJpb3J8ZW58MXx8fHwxNzU5OTAzNjYxfDA&ixlib=rb-4.1.0&q=80&w=1080',
      ],
      prev: 'project-6',
      next: 'project-2',
    },
    'project-2': {
      title: 'Executive Office Suite',
      location: 'Jakarta Pusat',
      client: 'Tech Innovate Inc.',
      date: 'December 2024',
      duration: '4 months',
      category: 'Commercial',
      style: 'Modern Luxury',
      description: 'A prestigious executive office designed to reflect the company\'s innovative spirit while maintaining a professional, sophisticated atmosphere.',
      concept: 'The design balances productivity with comfort, incorporating ergonomic furniture, advanced technology, and premium materials to create an inspiring workspace.',
      materials: [
        'Walnut wood panels',
        'Leather executive furniture',
        'Glass partition walls',
        'Acoustic ceiling panels',
        'LED ambient lighting',
      ],
      images: [
        'https://images.unsplash.com/photo-1641998148499-cb6b55a3c0d3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBvZmZpY2UlMjBpbnRlcmlvcnxlbnwxfHx8fDE3NTk5OTM4OTB8MA&ixlib=rb-4.1.0&q=80&w=1080',
      ],
      prev: 'project-1',
      next: 'project-3',
    },
    'project-3': {
      title: 'Elegant Master Bedroom',
      location: 'Tangerang',
      client: 'Mrs. Caroline',
      date: 'November 2024',
      duration: '2 months',
      category: 'Residential',
      style: 'Elegant Contemporary',
      description: 'A luxurious bedroom retreat designed for ultimate relaxation and comfort, featuring premium materials and sophisticated design elements.',
      concept: 'Creating a personal sanctuary with a harmonious blend of luxury and tranquility, using soft textures, warm lighting, and a neutral color palette.',
      materials: [
        'Upholstered headboard',
        'Hardwood flooring',
        'Custom wardrobes',
        'Designer chandeliers',
        'Blackout curtains',
      ],
      images: [
        'https://images.unsplash.com/photo-1704428382616-d8c65fdd76f4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVnYW50JTIwYmVkcm9vbSUyMGRlc2lnbnxlbnwxfHx8fDE3NTk5MjIwMTN8MA&ixlib=rb-4.1.0&q=80&w=1080',
      ],
      prev: 'project-2',
      next: 'project-4',
    },
    'project-4': {
      title: 'Contemporary Kitchen',
      location: 'Bekasi',
      client: 'The Johnson Family',
      date: 'October 2024',
      duration: '2.5 months',
      category: 'Residential',
      style: 'Modern Functional',
      description: 'A sleek, functional kitchen designed for both everyday cooking and entertaining, featuring top-of-the-line appliances and smart storage solutions.',
      concept: 'Maximizing efficiency and style with a modern layout that encourages family interaction while maintaining a clean, organized aesthetic.',
      materials: [
        'Quartz countertops',
        'Custom cabinetry',
        'Stainless steel appliances',
        'Under-cabinet lighting',
        'Ceramic tile backsplash',
      ],
      images: [
        'https://images.unsplash.com/photo-1641823911769-c55f23c25143?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBraXRjaGVuJTIwaW50ZXJpb3J8ZW58MXx8fHwxNzU5OTU2ODExfDA&ixlib=rb-4.1.0&q=80&w=1080',
      ],
      prev: 'project-3',
      next: 'project-5',
    },
    'project-5': {
      title: 'Artisan Café Interior',
      location: 'Bandung',
      client: 'Brew & Co.',
      date: 'September 2024',
      duration: '3 months',
      category: 'Commercial',
      style: 'Rustic Modern',
      description: 'A warm and inviting café space that blends rustic charm with modern design, creating a unique atmosphere for coffee lovers.',
      concept: 'Combining natural materials, warm lighting, and comfortable seating to create a welcoming environment that encourages customers to linger.',
      materials: [
        'Reclaimed wood',
        'Exposed brick walls',
        'Industrial lighting',
        'Concrete countertops',
        'Vintage furniture',
      ],
      images: [
        'https://images.unsplash.com/photo-1604266190639-ef8c24cfa1dc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYWZlJTIwaW50ZXJpb3IlMjBkZXNpZ258ZW58MXx8fHwxNzU5OTkzODkxfDA&ixlib=rb-4.1.0&q=80&w=1080',
      ],
      prev: 'project-4',
      next: 'project-6',
    },
    'project-6': {
      title: 'Minimalist Workspace',
      location: 'Surabaya',
      client: 'Creative Studio',
      date: 'August 2024',
      duration: '2 months',
      category: 'Commercial',
      style: 'Minimalist',
      description: 'A clean, distraction-free workspace designed to enhance creativity and productivity for a small creative team.',
      concept: 'Less is more - creating a serene environment with only essential elements, allowing focus and creativity to flourish.',
      materials: [
        'White painted walls',
        'Light wood desks',
        'Ergonomic chairs',
        'Hidden storage',
        'Natural lighting',
      ],
      images: [
        'https://images.unsplash.com/photo-1587522384446-64daf3e2689a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsaXN0JTIwd29ya3NwYWNlfGVufDF8fHx8MTc1OTk2MjM5MHww&ixlib=rb-4.1.0&q=80&w=1080',
      ],
      prev: 'project-5',
      next: 'project-1',
    },
  };

  const project = projects[projectId] || projects['project-1'];

  return (
    <div className="min-h-screen">
      {/* Hero Image */}
      <section className="relative h-[500px] bg-gray-900">
        <ImageWithFallback
          src={project.images[0]}
          alt={project.title}
          className="w-full h-full object-cover"
        />
      </section>

      {/* Project Details */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <h1 className="text-[#2C2C2C] mb-4">{project.title}</h1>
            <p className="text-gray-600 mb-8">{project.description}</p>

            <div className="mb-8">
              <h3 className="text-[#D4AF37] mb-4">Design Concept</h3>
              <p className="text-gray-600">{project.concept}</p>
            </div>

            <div className="mb-8">
              <h3 className="text-[#D4AF37] mb-4">Materials Used</h3>
              <ul className="space-y-2">
                {project.materials.map((material: string, index: number) => (
                  <li key={index} className="flex items-center gap-3 text-gray-600">
                    <div className="w-2 h-2 bg-[#D4AF37] rounded-full" />
                    {material}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 p-6 rounded-lg sticky top-24">
              <h4 className="text-[#2C2C2C] mb-6">Project Information</h4>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin size={20} className="text-[#D4AF37] mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="text-gray-700">{project.location}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <User size={20} className="text-[#D4AF37] mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">Client</p>
                    <p className="text-gray-700">{project.client}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Calendar size={20} className="text-[#D4AF37] mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">Completion Date</p>
                    <p className="text-gray-700">{project.date}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock size={20} className="text-[#D4AF37] mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">Duration</p>
                    <p className="text-gray-700">{project.duration}</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-500 mb-1">Category</p>
                  <p className="text-gray-700">{project.category}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-1">Style</p>
                  <p className="text-gray-700">{project.style}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center mt-16 pt-8 border-t border-gray-200">
          <button
            onClick={() => onNavigate(project.prev)}
            className="flex items-center gap-2 text-[#D4AF37] hover:text-[#C19B2B] transition-colors"
          >
            <ChevronLeft size={20} />
            Previous Project
          </button>
          <button
            onClick={() => onNavigate('portfolio')}
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Back to Portfolio
          </button>
          <button
            onClick={() => onNavigate(project.next)}
            className="flex items-center gap-2 text-[#D4AF37] hover:text-[#C19B2B] transition-colors"
          >
            Next Project
            <ChevronRight size={20} />
          </button>
        </div>
      </section>
    </div>
  );
}

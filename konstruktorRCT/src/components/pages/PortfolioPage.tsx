import { ImageWithFallback } from '../figma/ImageWithFallback';
import { useState } from 'react';

interface PortfolioPageProps {
  onNavigate: (page: string) => void;
}

export function PortfolioPage({ onNavigate }: PortfolioPageProps) {
  const [activeFilter, setActiveFilter] = useState('All');

  const projects = [
    {
      id: 1,
      title: 'Modern Living Room',
      category: 'Home',
      image: 'https://images.unsplash.com/photo-1667584523543-d1d9cc828a15?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBsaXZpbmclMjByb29tJTIwaW50ZXJpb3J8ZW58MXx8fHwxNzU5OTAzNjYxfDA&ixlib=rb-4.1.0&q=80&w=1080',
      description: 'A contemporary living space with minimalist aesthetics',
    },
    {
      id: 2,
      title: 'Executive Office Suite',
      category: 'Office',
      image: 'https://images.unsplash.com/photo-1641998148499-cb6b55a3c0d3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBvZmZpY2UlMjBpbnRlcmlvcnxlbnwxfHx8fDE3NTk5OTM4OTB8MA&ixlib=rb-4.1.0&q=80&w=1080',
      description: 'Sophisticated office design for modern professionals',
    },
    {
      id: 3,
      title: 'Elegant Master Bedroom',
      category: 'Home',
      image: 'https://images.unsplash.com/photo-1704428382616-d8c65fdd76f4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVnYW50JTIwYmVkcm9vbSUyMGRlc2lnbnxlbnwxfHx8fDE3NTk5MjIwMTN8MA&ixlib=rb-4.1.0&q=80&w=1080',
      description: 'Luxurious bedroom retreat with premium finishes',
    },
    {
      id: 4,
      title: 'Contemporary Kitchen',
      category: 'Home',
      image: 'https://images.unsplash.com/photo-1641823911769-c55f23c25143?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBraXRjaGVuJTIwaW50ZXJpb3J8ZW58MXx8fHwxNzU5OTU2ODExfDA&ixlib=rb-4.1.0&q=80&w=1080',
      description: 'Sleek kitchen design with modern appliances',
    },
    {
      id: 5,
      title: 'Artisan Café Interior',
      category: 'Café',
      image: 'https://images.unsplash.com/photo-1604266190639-ef8c24cfa1dc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYWZlJTIwaW50ZXJpb3IlMjBkZXNpZ258ZW58MXx8fHwxNzU5OTkzODkxfDA&ixlib=rb-4.1.0&q=80&w=1080',
      description: 'Cozy café with rustic charm and modern touches',
    },
    {
      id: 6,
      title: 'Minimalist Workspace',
      category: 'Office',
      image: 'https://images.unsplash.com/photo-1587522384446-64daf3e2689a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsaXN0JTIwd29ya3NwYWNlfGVufDF8fHx8MTc1OTk2MjM5MHww&ixlib=rb-4.1.0&q=80&w=1080',
      description: 'Clean and functional workspace design',
    },
  ];

  const categories = ['All', 'Home', 'Office', 'Café'];

  const filteredProjects =
    activeFilter === 'All'
      ? projects
      : projects.filter((project) => project.category === activeFilter);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[400px] bg-gray-900">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1667584523543-d1d9cc828a15?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBsaXZpbmclMjByb29tJTIwaW50ZXJpb3J8ZW58MXx8fHwxNzU5OTAzNjYxfDA&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Our Projects"
          className="w-full h-full object-cover opacity-50"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white px-4">
            <h1 className="text-5xl mb-4 text-white">Our Design Projects</h1>
            <p className="text-xl text-gray-200">
              Explore our portfolio of stunning interior transformations
            </p>
          </div>
        </div>
      </section>

      {/* Filter Buttons */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveFilter(category)}
              className={`px-6 py-2 rounded-full transition-colors ${
                activeFilter === category
                  ? 'bg-[#5BA8A8] text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="group cursor-pointer"
              onClick={() => onNavigate(`project-${project.id}`)}
            >
              <div className="relative overflow-hidden rounded-lg shadow-lg aspect-[4/3]">
                <ImageWithFallback
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                  <div className="p-6 text-white">
                    <h3 className="text-white mb-2">{project.title}</h3>
                    <p className="text-gray-200">{project.description}</p>
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <span className="text-sm text-[#5BA8A8]">{project.category}</span>
                <h4 className="text-[#2D3748]">{project.title}</h4>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-[#5BA8A8] mb-4">Want to See Your Project Here?</h2>
          <p className="text-gray-600 mb-8">
            Let's collaborate and create something extraordinary for your space
          </p>
          <button className="px-8 py-3 bg-[#E89B7C] text-white rounded-lg hover:bg-[#D8845F] transition-colors">
            Start Your Project
          </button>
        </div>
      </section>
    </div>
  );
}

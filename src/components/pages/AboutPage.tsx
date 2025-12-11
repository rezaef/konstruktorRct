import { ImageWithFallback } from '../figma/ImageWithFallback';
import { Target, Eye, Heart, Award, Users, Briefcase } from 'lucide-react';

export function AboutPage() {
  const team = [
    { name: 'Alexandra Smith', role: 'Lead Designer', experience: '12 years' },
    { name: 'David Brown', role: 'Project Manager', experience: '10 years' },
    { name: 'Sarah Williams', role: 'Interior Architect', experience: '8 years' },
    { name: 'Michael Lee', role: 'Senior Designer', experience: '9 years' },
  ];

  const stats = [
    { icon: Award, value: '15+', label: 'Years of Experience' },
    { icon: Briefcase, value: '200+', label: 'Projects Completed' },
    { icon: Users, value: '150+', label: 'Happy Clients' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[400px] bg-gray-900">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1716703373020-17ff360924ee?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbnRlcmlvciUyMGRlc2lnbiUyMHRlYW18ZW58MXx8fHwxNzU5OTA1MjkzfDA&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Our Team"
          className="w-full h-full object-cover opacity-50"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white px-4">
            <h1 className="text-5xl mb-4 text-white">About HDA Interior</h1>
            <p className="text-xl text-gray-200">
              Creating exceptional spaces since 2010
            </p>
          </div>
        </div>
      </section>

      {/* Company Story */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-[#5BA8A8] mb-6">Our Story</h2>
            <p className="text-gray-600 mb-4">
              Founded in 2010, HDA Interior began with a simple mission: to create beautiful, 
              functional spaces that enhance the way people live and work. What started as a small 
              design studio has grown into a full-service interior design and contracting firm.
            </p>
            <p className="text-gray-600 mb-4">
              Our team of experienced designers and craftsmen work collaboratively with clients to 
              bring their visions to life. We believe that great design is not just about aesthetics, 
              but about creating environments that inspire, comfort, and empower.
            </p>
            <p className="text-gray-600">
              Today, we're proud to have completed over 200 projects across residential, commercial, 
              and hospitality sectors, earning the trust and satisfaction of our clients through 
              exceptional quality and service.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1667584523543-d1d9cc828a15?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBsaXZpbmclMjByb29tJTIwaW50ZXJpb3J8ZW58MXx8fHwxNzU5OTAzNjYxfDA&ixlib=rb-4.1.0&q=80&w=1080"
              alt="Project 1"
              className="w-full h-48 object-cover rounded-lg"
            />
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1641998148499-cb6b55a3c0d3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBvZmZpY2UlMjBpbnRlcmlvcnxlbnwxfHx8fDE3NTk5OTM4OTB8MA&ixlib=rb-4.1.0&q=80&w=1080"
              alt="Project 2"
              className="w-full h-48 object-cover rounded-lg"
            />
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1704428382616-d8c65fdd76f4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVnYW50JTIwYmVkcm9vbSUyMGRlc2lnbnxlbnwxfHx8fDE3NTk5MjIwMTN8MA&ixlib=rb-4.1.0&q=80&w=1080"
              alt="Project 3"
              className="w-full h-48 object-cover rounded-lg"
            />
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1641823911769-c55f23c25143?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBraXRjaGVuJTIwaW50ZXJpb3J8ZW58MXx8fHwxNzU5OTU2ODExfDA&ixlib=rb-4.1.0&q=80&w=1080"
              alt="Project 4"
              className="w-full h-48 object-cover rounded-lg"
            />
          </div>
        </div>
      </section>

      {/* Mission, Vision, Values */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="w-14 h-14 bg-[#5BA8A8] rounded-full flex items-center justify-center mb-4">
                <Target size={28} className="text-white" />
              </div>
              <h3 className="text-[#2D3748] mb-4">Our Mission</h3>
              <p className="text-gray-600">
                To transform spaces into beautiful, functional environments that exceed our clients' 
                expectations through innovative design, quality craftsmanship, and exceptional service.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="w-14 h-14 bg-[#E89B7C] rounded-full flex items-center justify-center mb-4">
                <Eye size={28} className="text-white" />
              </div>
              <h3 className="text-[#2D3748] mb-4">Our Vision</h3>
              <p className="text-gray-600">
                To be the leading interior design and contracting firm recognized for creating 
                sustainable, innovative spaces that inspire and enhance the quality of life.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="w-14 h-14 bg-[#9B7CB5] rounded-full flex items-center justify-center mb-4">
                <Heart size={28} className="text-white" />
              </div>
              <h3 className="text-[#2D3748] mb-4">Our Values</h3>
              <p className="text-gray-600">
                Excellence, integrity, creativity, collaboration, and sustainability guide everything 
                we do. We're committed to delivering outstanding results while building lasting relationships.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="text-center">
                <div className="w-20 h-20 bg-[#5BA8A8] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon size={40} className="text-white" />
                </div>
                <h2 className="text-4xl text-[#2D3748] mb-2">{stat.value}</h2>
                <p className="text-gray-600">{stat.label}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Team */}
      <section className="bg-[#2D3748] text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-[#5BA8A8] mb-4">Meet Our Team</h2>
            <p className="text-gray-300">
              Talented professionals dedicated to bringing your vision to life
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div key={index} className="text-center">
                <div className="w-48 h-48 bg-gray-700 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Users size={64} className="text-gray-500" />
                </div>
                <h4 className="text-white mb-1">{member.name}</h4>
                <p className="text-[#5BA8A8] mb-1">{member.role}</p>
                <p className="text-gray-400">{member.experience} experience</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

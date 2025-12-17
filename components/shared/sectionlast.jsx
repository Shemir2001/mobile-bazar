'use client';

import { FiTruck, FiShield, FiRefreshCw, FiPhone } from 'react-icons/fi';
import { motion } from 'framer-motion';

const features = [
  {
    id: 1,
    icon: FiTruck,
    title: 'FREE SHIPPING',
    description: 'Free on order over 3000',
    stat: '24-48H',
    bgPattern: 'diagonal-lines',
  },
  {
    id: 2,
    icon: FiShield,
    title: 'SECURITY PAYMENT',
    description: '100% secure COD payment',
    stat: '100%',
    bgPattern: 'dots',
  },
  {
    id: 3,
    icon: FiRefreshCw,
    title: '30 DAY RETURN',
    description: '30 day money guarantee',
    stat: '30D',
    bgPattern: 'grid',
  },
  {
    id: 4,
    icon: FiPhone,
    title: '24/7 SUPPORT',
    description: 'Support every time fast',
    stat: '24/7',
    bgPattern: 'diagonal-lines',
  },
];

export default function FeaturesSection() {
  return (
    <section className="relative py-20 bg-gray-50 overflow-hidden">


      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-block mb-4">
            <div className="bg-red-600 text-white px-6 py-2 font-bold text-xs uppercase tracking-widest border-2 border-black">
              WHY CHOOSE US
            </div>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-black mb-4 tracking-tight">
            PREMIUM <span className="text-red-600">SERVICES</span>
          </h2>
          <div className="w-24 h-1 bg-red-600 mx-auto"></div>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group relative"
              >
                {/* Card Container */}
                <div className="relative bg-white h-full overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-red-600/20 border-2 border-gray-100 hover:border-red-600">
                  {/* Top Red Accent Bar */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-red-600 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                  
                  {/* Hover Background Effect */}
                  <div className="absolute inset-0 bg-red-600 opacity-0 group-hover:opacity-100 transition-all duration-500 transform scale-95 group-hover:scale-100"></div>

                  {/* Content */}
                  <div className="relative p-8 flex flex-col items-center text-center h-full">
                    {/* Icon Container */}
                    <div className="mb-6 relative">
                      {/* Background geometric shape */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-24 h-24 border-4 border-gray-200 group-hover:border-white transform rotate-45 transition-all duration-500 group-hover:rotate-180"></div>
                      </div>
                      
                      {/* Icon Circle */}
                      <div className="relative w-20 h-20 bg-black group-hover:bg-white flex items-center justify-center transform group-hover:scale-110 transition-all duration-500">
                        <Icon className="w-10 h-10 text-white group-hover:text-red-600 transition-colors duration-500" strokeWidth={2} />
                      </div>

                      {/* Stat Badge */}
                      <div className="absolute -bottom-2 -right-2 bg-red-600 group-hover:bg-white text-white group-hover:text-black px-3 py-1 text-xs font-bold uppercase tracking-wider border-2 border-white group-hover:border-red-600 transition-all duration-500">
                        {feature.stat}
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-black text-black group-hover:text-white mb-3 uppercase tracking-wide transition-colors duration-500">
                      {feature.title}
                    </h3>

                    {/* Divider */}
                    <div className="w-12 h-0.5 bg-red-600 group-hover:bg-white mb-3 transition-colors duration-500"></div>

                    {/* Description */}
                    <p className="text-gray-600 group-hover:text-gray-200 text-sm font-medium transition-colors duration-500">
                      {feature.description}
                    </p>

                    {/* Bottom decorative element */}
                    <div className="mt-auto pt-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <div className="flex items-center justify-center gap-1">
                        <div className="w-2 h-2 bg-white"></div>
                        <div className="w-2 h-2 bg-white"></div>
                        <div className="w-2 h-2 bg-white"></div>
                      </div>
                    </div>
                  </div>

                  {/* Corner accent */}
                  <div className="absolute bottom-0 right-0 w-16 h-16 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="absolute bottom-0 right-0 w-full h-full border-b-4 border-r-4 border-white"></div>
                  </div>
                </div>

                {/* Floating shadow effect */}
                <div className="absolute inset-0 bg-red-600 opacity-0 group-hover:opacity-20 blur-xl transform translate-y-2 transition-all duration-500"></div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center gap-4 bg-black border-2 border-red-600 px-8 py-6 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-red-600 flex items-center justify-center">
                <FiPhone className="w-6 h-6 text-white" />
              </div>
              <div className="text-left">
                <div className="text-xs text-gray-400 uppercase tracking-wider font-bold">Need Help?</div>
                <div className="text-xl font-bold text-white">+(92) 327-9949039</div>
              </div>
            </div>
            <div className="hidden sm:block w-px h-12 bg-white/20"></div>
            <div className="hidden sm:block text-gray-300 text-sm max-w-md">
              Our team is available to assist you with any questions
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
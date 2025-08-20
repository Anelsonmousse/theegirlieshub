import { Heart, MapPin, Phone, Mail, Instagram } from "lucide-react"

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 border-t border-pink-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Heart className="h-6 w-6 text-pink-500" fill="currentColor" />
              <h3 className="text-xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                Thee Girlies Hub
              </h3>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">
              Your ultimate destination for all things girly and fabulous! ✨ From sparkly accessories to cute essentials, we've got everything to make you shine.
            </p>
            <div className="flex items-center space-x-3">
              <span className="text-xs text-gray-500">Follow us:</span>
              <div className="flex space-x-3">
                <a 
                  href="https://www.instagram.com/thee.girlies.hub0" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-8 h-8 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform duration-200 shadow-lg hover:shadow-pink-200"
                >
                  <Instagram className="h-4 w-4" />
                </a>
                <a 
                  href="https://www.tiktok.com/@thee.girlies.hub0" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-8 h-8 bg-gradient-to-r from-gray-800 to-gray-900 rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform duration-200 shadow-lg hover:shadow-gray-300"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-800">Get in Touch</h4>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin className="h-4 w-4 text-pink-500 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-gray-600">
                  <p className="font-medium">Visit Our Store</p>
                  <p>Bakare Street</p>
                  <p>Surulere, Lagos, Nigeria</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-pink-500 flex-shrink-0" />
                <div className="text-sm text-gray-600">
                  <a href="tel:+2348012345678" className="hover:text-pink-600 transition-colors">
                    +234 704 160 4897
                  </a>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-pink-500 flex-shrink-0" />
                <div className="text-sm text-gray-600">
                  <a href="mailto:theegirlieshub@gmail.com" className="hover:text-pink-600 transition-colors">
                    theegirlieshub@gmail.com
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="mt-12 pt-8 border-t border-pink-200">
          <div className="max-w-md mx-auto text-center">
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Stay in the Loop! 💕</h4>
            <p className="text-sm text-gray-600 mb-4">
              Subscribe to get the latest girly updates, exclusive deals, and style tips!
            </p>
            <div className="flex">
              <input
                type="email"
                placeholder="Enter your email..."
                className="flex-1 px-4 py-2 text-sm border border-pink-200 rounded-l-full focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent"
              />
              <button className="px-6 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white text-sm font-medium rounded-r-full hover:from-pink-600 hover:to-purple-600 transition-all duration-200 shadow-lg hover:shadow-pink-200">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-8 pt-6 border-t border-pink-200">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="text-sm text-gray-600">
              © 2025 Thee Girlies Hub. Made with <Heart className="h-3 w-3 text-pink-500 inline mx-1" fill="currentColor" /> for all the girlies!
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400"></div>
    </footer>
  )
}

export default Footer
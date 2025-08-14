import Link from 'next/link'
import { Users, Clock, Target, Trophy, ArrowRight, Play } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-2">
              <div className="bg-primary-500 text-white p-2 rounded-lg">
                <Users className="w-6 h-6" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Sales Coffee Connector</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/login" className="text-gray-600 hover:text-gray-900 font-medium">
                Sign In
              </Link>
              <Link href="/signup" className="btn-primary">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Connect. Learn. Grow.
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Join thousands of sales professionals who are expanding their network through 
            15-minute virtual coffee chats. Get matched with peers who complement your skills 
            and experience.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup" className="inline-flex items-center btn-primary text-lg px-8 py-3">
              Start Networking <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <button className="inline-flex items-center btn-outline text-lg px-8 py-3">
              <Play className="mr-2 w-5 h-5" />
              Watch Demo
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Why Sales Professionals Choose Us
            </h3>
            <p className="text-xl text-gray-600">
              Our platform makes networking effortless and meaningful
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-primary-100 text-primary-600 p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-semibold mb-2">Smart Matching</h4>
              <p className="text-gray-600">
                Our algorithm pairs you with professionals who complement your skills and goals
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary-100 text-primary-600 p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-semibold mb-2">15-Minute Sessions</h4>
              <p className="text-gray-600">
                Quick, focused conversations that fit into your busy schedule
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary-100 text-primary-600 p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-semibold mb-2">Quality Network</h4>
              <p className="text-gray-600">
                Connect with verified sales professionals from diverse industries
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary-100 text-primary-600 p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Trophy className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-semibold mb-2">Track Success</h4>
              <p className="text-gray-600">
                Monitor your networking progress and celebrate your wins
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-primary-600 mb-2">5,000+</div>
              <p className="text-gray-600">Active Sales Professionals</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary-600 mb-2">50,000+</div>
              <p className="text-gray-600">Successful Connections</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary-600 mb-2">4.8★</div>
              <p className="text-gray-600">Average Session Rating</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-3xl font-bold text-white mb-4">
            Ready to Expand Your Sales Network?
          </h3>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of sales professionals who are already growing their careers through meaningful connections.
          </p>
          <Link href="/signup" className="inline-flex items-center bg-white text-primary-600 font-semibold px-8 py-3 rounded-lg hover:bg-gray-50 transition-colors">
            Get Started Free <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="bg-primary-500 text-white p-2 rounded-lg">
                <Users className="w-6 h-6" />
              </div>
              <span className="text-xl font-bold text-white">Sales Coffee Connector</span>
            </div>
            <p className="text-gray-400 text-center md:text-right">
              © 2024 Sales Coffee Connector. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
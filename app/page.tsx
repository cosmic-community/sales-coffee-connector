import Link from 'next/link'
import { Users, Clock, Target, Trophy, ArrowRight, Play, Star, Zap, Heart } from 'lucide-react'

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
                Join the Community
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-6">
            <div className="inline-flex items-center bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Star className="w-4 h-4 mr-2" />
              Building the Future of Sales Networking
            </div>
          </div>
          <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Your Next Career Breakthrough<br />
            <span className="text-blue-600">Starts with Coffee</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-4xl mx-auto">
            Imagine connecting with sales leaders who've walked your path, sharing strategies that 
            actually work, and building relationships that transform careers. This isn't just networking—
            it's your gateway to the sales community you've always wanted to be part of.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup" className="inline-flex items-center btn-primary text-lg px-8 py-4 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all">
              <Zap className="mr-2 w-6 h-6" />
              Start Your Journey <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <button className="inline-flex items-center btn-outline text-lg px-8 py-4 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all">
              <Play className="mr-2 w-5 h-5" />
              See How It Works
            </button>
          </div>
          <p className="text-sm text-gray-500 mt-4">
            ✨ Free to join • 🚀 Launch your network in minutes • 💎 Premium connections await
          </p>
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              The Sales Community You've Been Searching For
            </h3>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're building something extraordinary—a place where ambitious sales professionals 
              connect, learn, and grow together. Here's what awaits you.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center group hover:scale-105 transition-transform">
              <div className="bg-gradient-to-br from-blue-100 to-blue-200 text-blue-600 p-4 rounded-2xl w-20 h-20 flex items-center justify-center mx-auto mb-4 group-hover:shadow-lg transition-shadow">
                <Target className="w-10 h-10" />
              </div>
              <h4 className="text-xl font-semibold mb-3">Perfect Matches</h4>
              <p className="text-gray-600">
                Our AI connects you with professionals whose expertise complements your goals, 
                creating meaningful conversations that matter.
              </p>
            </div>

            <div className="text-center group hover:scale-105 transition-transform">
              <div className="bg-gradient-to-br from-green-100 to-green-200 text-green-600 p-4 rounded-2xl w-20 h-20 flex items-center justify-center mx-auto mb-4 group-hover:shadow-lg transition-shadow">
                <Clock className="w-10 h-10" />
              </div>
              <h4 className="text-xl font-semibold mb-3">Time That Counts</h4>
              <p className="text-gray-600">
                Just 15 minutes can change your perspective, open new doors, and spark ideas 
                that transform your entire sales approach.
              </p>
            </div>

            <div className="text-center group hover:scale-105 transition-transform">
              <div className="bg-gradient-to-br from-purple-100 to-purple-200 text-purple-600 p-4 rounded-2xl w-20 h-20 flex items-center justify-center mx-auto mb-4 group-hover:shadow-lg transition-shadow">
                <Heart className="w-10 h-10" />
              </div>
              <h4 className="text-xl font-semibold mb-3">Genuine Community</h4>
              <p className="text-gray-600">
                Beyond transactions and quotas, discover a community where sales professionals 
                genuinely support each other's success and growth.
              </p>
            </div>

            <div className="text-center group hover:scale-105 transition-transform">
              <div className="bg-gradient-to-br from-yellow-100 to-yellow-200 text-yellow-600 p-4 rounded-2xl w-20 h-20 flex items-center justify-center mx-auto mb-4 group-hover:shadow-lg transition-shadow">
                <Trophy className="w-10 h-10" />
              </div>
              <h4 className="text-xl font-semibold mb-3">Celebrate Wins</h4>
              <p className="text-gray-600">
                Share your victories, learn from challenges, and be part of a community 
                that celebrates every step of your sales journey.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Aspiration Stats Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-white mb-4">
              Join the Movement That's Reshaping Sales
            </h3>
            <p className="text-xl text-blue-100">
              These aren't just numbers—they represent dreams coming true, careers accelerating, and connections that last a lifetime.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <div className="text-5xl font-bold text-white mb-2">10K+</div>
              <p className="text-blue-100 mb-2">Sales Professionals Ready to Connect</p>
              <p className="text-sm text-blue-200">From startups to Fortune 500 companies</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <div className="text-5xl font-bold text-white mb-2">100K+</div>
              <p className="text-blue-100 mb-2">Life-Changing Conversations Waiting</p>
              <p className="text-sm text-blue-200">Each one a potential career catalyst</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <div className="text-5xl font-bold text-white mb-2">∞</div>
              <p className="text-blue-100 mb-2">Possibilities for Your Future</p>
              <p className="text-sm text-blue-200">The only limit is your imagination</p>
            </div>
          </div>
        </div>
      </section>

      {/* Dream Scenarios */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Imagine Your Success Story
            </h3>
            <p className="text-xl text-gray-600">
              Picture yourself six months from now, with a network that opens doors you never knew existed.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="flex items-start space-x-4">
                <div className="bg-blue-100 text-blue-600 p-3 rounded-full flex-shrink-0">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-gray-900 mb-2">
                    The Mentor Connection
                  </h4>
                  <p className="text-gray-600">
                    You'll connect with that senior VP who shares the exact strategy you need to close 
                    your biggest deal. The conversation flows naturally, advice is practical, and suddenly 
                    your path forward becomes crystal clear.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="bg-green-100 text-green-600 p-3 rounded-full flex-shrink-0">
                  <Trophy className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-gray-900 mb-2">
                    The Career Pivot
                  </h4>
                  <p className="text-gray-600">
                    That 15-minute coffee chat with someone in your dream industry reveals they're hiring. 
                    Six weeks later, you're starting your ideal role, all because you took the leap to connect.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="bg-purple-100 text-purple-600 p-3 rounded-full flex-shrink-0">
                  <Heart className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-gray-900 mb-2">
                    The Lifelong Partnership
                  </h4>
                  <p className="text-gray-600">
                    You meet someone who becomes not just a professional contact, but a true advocate 
                    for your career. Years later, you're still celebrating wins together.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-8 text-white">
              <div className="text-center">
                <div className="bg-white/20 rounded-full p-6 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                  <Star className="w-12 h-12" />
                </div>
                <h4 className="text-2xl font-bold mb-4">Your Story Starts Here</h4>
                <p className="text-blue-100 mb-6">
                  Every great sales career has turning points. Every breakthrough moment started 
                  with a single connection. Your moment is waiting.
                </p>
                <Link href="/signup" className="inline-flex items-center bg-white text-blue-600 px-6 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors">
                  Write Your Chapter <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-gradient-to-r from-gray-900 to-blue-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-4xl font-bold text-white mb-6">
            The Sales Community You Deserve Is One Click Away
          </h3>
          <p className="text-xl text-gray-300 mb-8 leading-relaxed">
            Stop wondering "what if" and start experiencing "what is." Join thousands of ambitious 
            sales professionals who chose to invest in their greatest asset: their network. 
            Your future self will thank you.
          </p>
          <div className="space-y-4">
            <Link href="/signup" className="inline-flex items-center bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold px-10 py-4 rounded-2xl text-lg shadow-2xl hover:shadow-3xl transform hover:-translate-y-2 transition-all duration-300">
              <Zap className="mr-3 w-6 h-6" />
              Begin Your Transformation
              <ArrowRight className="ml-3 w-6 h-6" />
            </Link>
            <p className="text-gray-400 text-sm">
              Free forever • No credit card required • Start connecting in under 2 minutes
            </p>
          </div>
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
            <div className="flex items-center space-x-6 text-gray-400">
              <span className="text-sm">Building the future of sales networking</span>
              <div className="flex items-center space-x-2">
                <Heart className="w-4 h-4 text-red-500" />
                <span className="text-sm">Made with passion for sales success</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
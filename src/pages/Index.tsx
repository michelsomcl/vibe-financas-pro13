
import { Plus, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Header */}
      <header className="w-full px-6 py-4 bg-white/80 backdrop-blur-sm border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-semibold text-slate-800">Project</span>
          </div>
          <Button variant="outline" size="sm">
            Get Started
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex items-center justify-center px-6 py-20">
        <div className="text-center max-w-2xl mx-auto">
          {/* Empty State Illustration */}
          <div className="mb-8 relative">
            <div className="w-32 h-32 mx-auto bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 animate-pulse"></div>
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center relative z-10">
                <Plus className="w-8 h-8 text-white" />
              </div>
            </div>
            {/* Floating dots animation */}
            <div className="absolute top-8 left-1/2 transform -translate-x-1/2">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-100"></div>
            </div>
            <div className="absolute top-16 right-8">
              <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce delay-300"></div>
            </div>
            <div className="absolute bottom-8 left-8">
              <div className="w-1.5 h-1.5 bg-blue-300 rounded-full animate-bounce delay-500"></div>
            </div>
          </div>

          {/* Content */}
          <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4 tracking-tight">
            Your Canvas Awaits
          </h1>
          <p className="text-xl text-slate-600 mb-8 leading-relaxed">
            Start building something amazing. This is your blank canvas ready to be transformed into your next great idea.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200">
              <Plus className="w-5 h-5 mr-2" />
              Create New Project
            </Button>
            <Button variant="outline" size="lg" className="border-slate-300 hover:bg-slate-50 transition-all duration-200">
              Browse Templates
            </Button>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-6 mt-16">
            <Card className="p-6 text-center border-slate-200 hover:shadow-lg transition-shadow duration-200 bg-white/60 backdrop-blur-sm">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-slate-800 mb-2">Fast Setup</h3>
              <p className="text-sm text-slate-600">Get started in seconds with our streamlined workflow</p>
            </Card>

            <Card className="p-6 text-center border-slate-200 hover:shadow-lg transition-shadow duration-200 bg-white/60 backdrop-blur-sm">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Plus className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-slate-800 mb-2">Flexible</h3>
              <p className="text-sm text-slate-600">Adapt and customize to fit your unique requirements</p>
            </Card>

            <Card className="p-6 text-center border-slate-200 hover:shadow-lg transition-shadow duration-200 bg-white/60 backdrop-blur-sm">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <ArrowRight className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-slate-800 mb-2">Scalable</h3>
              <p className="text-sm text-slate-600">Grow your project from idea to production seamlessly</p>
            </Card>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="absolute bottom-0 w-full py-6 text-center text-sm text-slate-500 bg-white/50 backdrop-blur-sm border-t border-slate-200/60">
        <p>Ready to build something extraordinary?</p>
      </footer>
    </div>
  );
};

export default Index;

import React from 'react';

const FeaturesSection = () => {
  return (
    <section className="py-8 sm:py-12 md:py-16 px-4 sm:px-6 bg-gradient-to-br from-white to-pink-300 relative z-10">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 sm:mb-12 text-black">What You’ll Get ?</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
          {/* Track Your Progress */}
          <div className="text-center p-4 sm:p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="text-3xl sm:text-4xl mb-4">📊</div>
            <h3 className="text-lg sm:text-xl font-bold mb-2 text-black">Track Your Progress</h3>
            <p className="text-sm sm:text-base text-black">
              Stay informed about your pregnancy journey. Track your weekly and daily progress with data-driven insights on baby growth, weight, and milestones.
            </p>
          </div>

          {/* Mom’s Tools */}
          <div className="text-center p-4 sm:p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="text-3xl sm:text-4xl mb-4">🧘‍♀️</div>
            <h3 className="text-lg sm:text-xl font-bold mb-2 text-black">Mom’s Tools</h3>
            <p className="text-sm sm:text-base text-black">
              Access smart tools for kick counting, contraction timing, mood tracking, meal plans and many more — all designed to make your pregnancy smoother.
            </p>
          </div>

          {/* Baby Development */}
          <div className="text-center p-4 sm:p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="text-3xl sm:text-4xl mb-4">👶</div>
            <h3 className="text-lg sm:text-xl font-bold mb-2 text-black">Baby Development</h3>
            <p className="text-sm sm:text-base text-black">
              Discover how your baby grows each week — from head to toe. Track the baby’s size compared to fruits, explore detailed growth milestones, and follow development progress — all backed by trusted medical sources.
            </p>
          </div>

          {/* Learning Resources */}
          <div className="text-center p-4 sm:p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="text-3xl sm:text-4xl mb-4">📚</div>
            <h3 className="text-lg sm:text-xl font-bold mb-2 text-black">Learning Resources</h3>
            <p className="text-sm sm:text-base text-black">
              Explore curated articles, expert tips, and medical recommendations on nutrition, mental health, and prenatal care — all in one place.
            </p>
          </div>

          {/* Download Report PDF */}
          <div className="text-center p-4 sm:p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="text-3xl sm:text-4xl mb-4">📄</div>
            <h3 className="text-lg sm:text-xl font-bold mb-2 text-black">Download Report PDF</h3>
            <p className="text-sm sm:text-base text-black">
              Instantly generate and download a personalized pregnancy progress report with your health stats, milestones.
            </p>
          </div>

          {/* Best YouTube Videos */}
          <div className="text-center p-4 sm:p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="text-3xl sm:text-4xl mb-4">🎥</div>
            <h3 className="text-lg sm:text-xl font-bold mb-2 text-black">Best YouTube Videos</h3>
            <p className="text-sm sm:text-base text-black">
              Watch handpicked pregnancy videos from trusted doctors, fitness coaches, and real moms — covering each stage of your journey.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;

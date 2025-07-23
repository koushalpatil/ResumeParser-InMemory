import { stepsData, sectionHeadings } from "../data";

const HowItWorksSection = () => {
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {sectionHeadings.howItWorks.title}
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {sectionHeadings.howItWorks.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {stepsData.map((step, index) => (
            <div key={index} className="text-center">
              <div className="relative mb-8">
                <div className="bg-gradient-to-br from-blue-500 to-purple-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <step.icon className="h-8 w-8 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 bg-white border-2 border-blue-500 w-8 h-8 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-bold text-sm">
                    {step.step}
                  </span>
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {step.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;

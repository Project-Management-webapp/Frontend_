import React from 'react';

const DashboardCard = ({
  title,
  value,
  subtitle,
  IconComponent,
  iconColor = 'text-gray-400',
  valueColor = 'text-white', 
  trend, 
}) => {
  const trendColorClasses = {
    green: {
      bg: 'bg-green-400/10',
      text: 'text-green-400',
    },
    yellow: {
      bg: 'bg-yellow-400/10',
      text: 'text-yellow-400',
    },
  };

  const trendClasses = trend ? trendColorClasses[trend.color] : null;

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 sm:p-6 border border-white/20 transform hover:scale-105 transition-transform duration-300">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-base sm:text-lg font-semibold mb-1 text-gray-300">{title}</h3>
          <p className={`text-2xl sm:text-4xl font-bold ${valueColor}`}>{value}</p>
          {subtitle && <p className="text-xs sm:text-sm text-gray-400 mt-2">{subtitle}</p>}
        </div>

        <div className="flex flex-col items-end text-right">
          {IconComponent && <IconComponent className={`text-4xl sm:text-5xl ${iconColor}`} />}
         
          {trend && trendClasses && (
            <div className={`rounded-full px-2 py-1 mt-2 ${trendClasses.bg}`}>
              <span className={`text-xs font-medium ${trendClasses.text}`}>{trend.value}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardCard;
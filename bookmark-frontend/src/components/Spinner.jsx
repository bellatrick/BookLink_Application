import React from 'react';

const Spinner = ({ size = 48 }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <div
        className="animate-spin rounded-full border-t-4 border-r-4 border-transparent"
        style={{
          width: size,
          height: size,
          borderTopColor: 'pink',
          borderRightColor: 'purple',
        }}
      ></div>
    </div>
  );
};

export default Spinner;

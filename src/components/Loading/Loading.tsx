const LoadingDots = () => (
  <div className="flex items-right w-15">
    <div className='flex bg-gray-100 p-2 rounded-full gap-1'>
      <span className="w-1 h-1 bg-gray-500 rounded-full animate-bounce delay-100"></span>
      <span className="w-1 h-1 bg-gray-500 rounded-full animate-bounce delay-200"></span>
      <span className="w-1 h-1 bg-gray-500 rounded-full animate-bounce delay-300"></span>
    </div>
  </div>
);

export default LoadingDots;

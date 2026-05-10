import logo from '../assets/Logo.avif';

function Title() {
  return (
    <span className="flex items-center px-7 py-2 border-white border-2 gap-2 w-auto  rounded-3xl ">
      <img src={logo} alt="Logo" className="w-6 h-6" />
      <h1 className="text-lg sm:text-3xl whitespace-nowrap font-bold text-pink-600">
        Password Manager
      </h1>
    </span>
  );
}

export default Title;
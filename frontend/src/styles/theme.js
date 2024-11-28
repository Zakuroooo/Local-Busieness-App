const theme = {
  colors: {
    background: "bg-gradient-to-br from-slate-50 to-gray-100",
    card: "bg-white/80 backdrop-blur-xl",
    primary: {
      gradient:
        "bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700",
      text: "text-indigo-600",
      light: "bg-indigo-50 text-indigo-600",
    },
    secondary: {
      gradient:
        "bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600",
      text: "text-rose-500",
    },
    success: {
      gradient: "bg-gradient-to-r from-emerald-500 to-teal-500",
      text: "text-emerald-500",
    },
  },
  rounded: "rounded-xl",
  shadow: "shadow-lg shadow-gray-200/50",
  transition: "transition-all duration-300",
  hover: "hover:shadow-xl hover:shadow-gray-200/50 hover:scale-[1.02]",
  input: "focus:ring-2 focus:ring-violet-500 focus:border-transparent",
  glass: "backdrop-blur-xl bg-white/80",
};

export default theme;

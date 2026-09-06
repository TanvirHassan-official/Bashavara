export default function Footer() {
  return (
    <footer className="bg-slate-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path
                  d="M9 2L2 8v8h5v-5h4v5h5V8L9 2z"
                  fill="white"
                />
              </svg>
            </div>
            <span className="font-heading text-xl font-bold text-white">
              BashaVara
            </span>
          </div>
          <p className="text-slate-500 text-sm">
            © 2025 BashaVara. Student housing, simplified. For .edu accounts
            only.
          </p>
          <div className="flex gap-6 text-sm text-slate-500">
            <a
              href="#"
              className="hover:text-slate-300 transition-colors"
            >
              Privacy
            </a>
            <a
              href="#"
              className="hover:text-slate-300 transition-colors"
            >
              Terms
            </a>
            <a
              href="#"
              className="hover:text-slate-300 transition-colors"
            >
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function Footer() {
  return (
    <footer className="w-full mt-12 py-10 px-8 bg-surface-container">
      <div className="max-w-screen-xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex flex-col items-center md:items-start gap-2">
          <span className="font-headline font-bold text-primary text-xl">FreshStart</span>
          <p className="font-body text-base text-on-background opacity-80">
            &copy; 2024 FreshStart NYC. You've got this.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-8">
          {['Privacy Policy', 'Terms of Service', 'Help Center', 'Contact Us'].map((link) => (
            <a
              key={link}
              href="#"
              className="font-body text-base text-on-background opacity-80 hover:text-primary transition-all hover:translate-x-1 duration-300"
            >
              {link}
            </a>
          ))}
        </div>
      </div>
    </footer>
  )
}

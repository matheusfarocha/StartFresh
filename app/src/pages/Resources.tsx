export default function Resources() {
  return (
    <main className="mt-24 max-w-7xl mx-auto px-6 mb-12">
      <header className="mb-12 text-center md:text-center">
        <h1 className="text-display-lg font-extrabold text-on-surface tracking-tight mb-4">Find Your Path Forward</h1>
        <p className="text-body-lg text-on-surface-variant max-w-2xl leading-relaxed mb-8 mx-auto">
          Access local support, essential documents, and tools designed to help you build a stable future. We&#8217;re here to help you every step of the way.
        </p>
        <div className="relative max-w-3xl mx-auto">
          <input
            className="w-full bg-surface-container-highest rounded-xl px-6 py-5 text-body-lg focus:outline-none focus:ring-4 focus:ring-primary-fixed border-none shadow-none"
            placeholder="Search for housing, legal aid, or jobs..."
            type="text"
          />
          <button className="absolute right-3 top-2.5 bg-primary-container text-on-primary-container px-6 py-3 rounded-lg font-bold block-shadow shadow-primary">
            Search
          </button>
        </div>
      </header>

      <section className="mb-12">
        <div className="flex flex-wrap gap-4 items-center justify-center">
          <button className="px-8 py-3 rounded-full bg-primary text-on-primary font-bold transition-all shadow-none">All Resources</button>
          <button className="px-8 py-3 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface font-semibold transition-all">Housing</button>
          <button className="px-8 py-3 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface font-semibold transition-all">ID & Benefits</button>
          <button className="px-8 py-3 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface font-semibold transition-all">Employment</button>
          <button className="px-8 py-3 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface font-semibold transition-all">Mental Health</button>
        </div>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        <div className="bg-surface-container-low rounded-lg p-4 flex flex-col transition-all duration-300 hover:bg-surface-container">
          <div className="h-48 rounded-lg overflow-hidden mb-6">
            <img className="w-full h-full object-cover" alt="Housing" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDlxO2hDqDW06kQ3-vxeb2w3MxoU98JLWlBX8tGrtswpZ9LBfDU7-WvwygMj74VleoA6xEh-kZDkXFnPDBEki4aej91SxlneqOXjrQmfKOFQTx2LS_u8ORP9u6y8dt0Iy-LMRC6OnHiV7IlylpeygC7DCaUEaX1XxjFBi_GmK4SPm7neqoqp8e0oQKBlY-YeSDyKX0y12rEYUnDCyjL57iEgnANSfx0c8HXSs4ZxTWNJo3UKUbTIe1jlu4iV3oggIj5WR50G9XRUCVi" />
          </div>
          <div className="flex-1 flex flex-col">
            <span className="text-label-md font-bold uppercase tracking-widest text-secondary mb-2">Housing</span>
            <h4 className="text-headline-sm font-bold mb-3">Safe Haven Registry</h4>
            <p className="text-body-lg text-on-surface-variant mb-6 line-clamp-3">
              Access a curated database of verified transitional housing and rental assistance programs tailored for newcomers.
            </p>
            <button className="mt-auto w-full py-4 rounded-md bg-surface-container-highest text-on-surface font-bold block-shadow shadow-outline-variant transition-all">
              Show Details
            </button>
          </div>
        </div>

        <div className="bg-surface-container-low rounded-lg p-4 flex flex-col transition-all duration-300 hover:bg-surface-container">
          <div className="h-48 rounded-lg overflow-hidden mb-6">
            <img className="w-full h-full object-cover" alt="ID & Benefits" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDw0u5iWjRzMYHDhy2SVCo7RbZK9EevLHN4GVdd80gNum9lCca809sGrFDVR_pBs-MLTq9-vuB2AtzendBDO0EUxgvPXoGCbJuqLhkDrknGKILREJL7TOMKDytJLOA3oxE-V6vzpWtFPdDFj5sm-Y7Co6X7bVhQT9_nvl_Iz37pcwwqySyFZyVDjIuWZzEDFhKmufxXLufYhcnBLCye9BiYElGZa2Tu5dIR2qWmSqp9pEVpCURdzSyz-i7h5fI6WCh5_Iy2O0Ht6x6A" />
          </div>
          <div className="flex-1 flex flex-col">
            <span className="text-label-md font-bold uppercase tracking-widest text-primary mb-2">ID & Benefits</span>
            <h4 className="text-headline-sm font-bold mb-3">Identity Recovery Toolkit</h4>
            <p className="text-body-lg text-on-surface-variant mb-6 line-clamp-3">
              Step-by-step guidance on recovering lost birth certificates, social security cards, and state IDs.
            </p>
            <button className="mt-auto w-full py-4 rounded-md bg-surface-container-highest text-on-surface font-bold block-shadow shadow-outline-variant transition-all">
              Show Details
            </button>
          </div>
        </div>

        <div className="bg-surface-container-low rounded-lg p-4 flex flex-col transition-all duration-300 hover:bg-surface-container">
          <div className="h-48 rounded-lg overflow-hidden mb-6">
            <img className="w-full h-full object-cover" alt="Employment" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC4FN40p8niJBwyr5CQPtxS5IZG7ebrYj5JZ1CyN0BYGx4sdW2FYK_ga2Osrn79q5dtjFrvONcxfCB-F4gZEFMLUbZX6HiaNzgXn_U6qZZX1ET-ZTZrGWrJsqsPht4zBKZdVXIDSdOwiKNdQgwJE0IeJtev-vXjtfGkKTrzLawdGowwM05XzFkkn7kD5RwIpBIRViGHqoNtFg22QQYkA5waw5JEKKO6JXxHAMWunxHhHE_u2vyWlQq-iUAAPFY-Ao3is8UU4" />
          </div>
          <div className="flex-1 flex flex-col">
            <span className="text-label-md font-bold uppercase tracking-widest text-tertiary mb-2">Employment</span>
            <h4 className="text-headline-sm font-bold mb-3">Skill-Up Workshop</h4>
            <p className="text-body-lg text-on-surface-variant mb-6 line-clamp-3">
              Connect with local employers offering on-the-job training and fair wages for entry-level positions.
            </p>
            <button className="mt-auto w-full py-4 rounded-md bg-surface-container-highest text-on-surface font-bold block-shadow shadow-outline-variant transition-all">
              Show Details
            </button>
          </div>
        </div>

        <div className="bg-surface-container-low rounded-lg p-4 flex flex-col transition-all duration-300 hover:bg-surface-container">
          <div className="h-48 rounded-lg overflow-hidden mb-6">
            <img className="w-full h-full object-cover" alt="Mental Health" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCpSBu28rhnNyPlrGXzF1fp1a62qixA_YN2FrIVglyHsdk0Ps3c--qhOOGRRJERInSunB3yuWJtsT-QvsRu3akDlEXP83ACJL2jcXMoLrmrlJz0tjVyoBQwNpeV3f2S7ceYH5M2h0Orbbxr4QMvvWDC4T36-eVaRFe3rsz7PFFLd5QzxGvkrT06HbPrdB6-k3TAtLwZhUlh5PkhxpwjLei6JFgYJe_R3cZACCixH0oSiRlG2Ll8E-WVmDBZkjO8uq2Colk3XzOMpx6A" />
          </div>
          <div className="flex-1 flex flex-col">
            <span className="text-label-md font-bold uppercase tracking-widest text-secondary mb-2">Mental Health</span>
            <h4 className="text-headline-sm font-bold mb-3">Wellness Collective</h4>
            <p className="text-body-lg text-on-surface-variant mb-6 line-clamp-3">
              Free weekly group therapy sessions and individual peer support to help manage stress and trauma.
            </p>
            <button className="mt-auto w-full py-4 rounded-md bg-surface-container-highest text-on-surface font-bold block-shadow shadow-outline-variant transition-all">
              Show Details
            </button>
          </div>
        </div>

        <div className="bg-surface-container-low rounded-lg p-4 flex flex-col transition-all duration-300 hover:bg-surface-container">
          <div className="h-48 rounded-lg overflow-hidden mb-6">
            <img className="w-full h-full object-cover" alt="ID & Benefits" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBOSRrA270oOapAj-vRK9nMenVVCCTgXFE8hMETva7WsqwCCyKrFLmh8SaorG1TcROTLzuio9K5eS1-UdLUs6S-AcPFQ6JSA_681Wp5ti84LYREjqMWZ-cMe_U2BTVNatsKMO2OhrrwUevOA1SkUqqG_QMKcQqkvYndbrK3n7uQMB8qnQc1Cn5QSPH5MpSl_FdsOB5HCZqa4ygYz3hybuUDBeEuwvTRCDSY02Te4Fr-Xcv9Fe7tWcT4frBXC6Nz3JwIe_-68vYhffoi" />
          </div>
          <div className="flex-1 flex flex-col">
            <span className="text-label-md font-bold uppercase tracking-widest text-primary mb-2">ID & Benefits</span>
            <h4 className="text-headline-sm font-bold mb-3">Legal Aid Partnership</h4>
            <p className="text-body-lg text-on-surface-variant mb-6 line-clamp-3">
              Pro-bono legal services to help resolve outstanding issues or navigate complex benefit applications.
            </p>
            <button className="mt-auto w-full py-4 rounded-md bg-surface-container-highest text-on-surface font-bold block-shadow shadow-outline-variant transition-all">
              Show Details
            </button>
          </div>
        </div>

        <div className="bg-surface-container-low rounded-lg p-4 flex flex-col transition-all duration-300 hover:bg-surface-container">
          <div className="h-48 rounded-lg overflow-hidden mb-6">
            <div className="w-full h-full bg-gradient-to-br from-tertiary-container to-tertiary flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-6xl">add_circle</span>
            </div>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <h4 className="text-headline-sm font-bold mb-3">Suggest a Resource</h4>
            <p className="text-body-lg text-on-surface-variant mb-6">
              Know of a service that could help others? Let us know so we can add it to our directory.
            </p>
            <button className="mt-auto w-full py-4 rounded-md bg-tertiary-container text-on-tertiary-container font-bold block-shadow shadow-tertiary transition-all">
              Contribute
            </button>
          </div>
        </div>
      </section>
    </main>
  )
}

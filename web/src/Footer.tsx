import React from "react";

interface FooterLinkProps {
  children: React.ReactNode,
  href: string
}

const FooterLink: React.FC<FooterLinkProps> = ({ children, href }) => {
  return <a className="text-fuchsia-400 hover:text-fuchsia-500 dark:text-fuchsia-300 dark:hover:text-fuchsia-400" href={href}>{children}</a>
}

const Footer: React.FC = () => {
  return (
    <footer>
      <div className="flex flex-row w-screen ">
        <div className="p-4 flex-1 place-items-center" >
          <p>Contribute to <FooterLink href="https://opensky-network.org/">OpenSky Network</FooterLink>, it's cool.</p>
        </div>
        <div className="p-4 flex-1 place-items-center">
          <p>See <FooterLink href="https://github.com/billyedmoore/lhrnet/">the repository</FooterLink> behind the project.</p>
        </div>
        <div className="p-4 flex-1 place-items-center">
          <p>Three <FooterLink href="https://england.shelter.org.uk/donate">links</FooterLink> look better than two.</p>
        </div>
      </div>

    </footer >
  )
}

export default Footer

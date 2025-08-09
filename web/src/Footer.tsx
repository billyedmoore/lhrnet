import React, { type PropsWithChildren } from "react";

interface FooterLinkProps extends PropsWithChildren {
  href: string
}

const FooterLink: React.FC<FooterLinkProps> = ({ children, href }) => {
  return <a className="text-fuchsia-400 hover:text-fuchsia-500 dark:text-fuchsia-300 dark:hover:text-fuchsia-400" href={href}>{children}</a>
}

interface FooterElemProps extends PropsWithChildren {
  hiddenOnSmallScreens?: boolean
}

const FooterElem: React.FC<FooterElemProps> = ({ children, hiddenOnSmallScreens }) => {
  const hideString = (hiddenOnSmallScreens ? " hidden sm:block" : "")
  return (<div className={`sm:p-4 flex-1 place-items-center${hideString}`} >
    {children}
  </div >)
}

const Footer: React.FC = () => {
  return (
    <footer>
      <div className="flex flex-col sm:flex-row w-screen p-4 sm:p-0">
        <FooterElem>
          <p className="text-center">Contribute to <FooterLink href="https://opensky-network.org/">OpenSky Network</FooterLink>, it's cool.</p>
        </FooterElem>
        <FooterElem>
          <p className="text-center">See <FooterLink href="https://github.com/billyedmoore/lhrnet/">the repository</FooterLink> behind the project.</p>
        </FooterElem>
        <FooterElem hiddenOnSmallScreens={true}>
          <p className="text-center">Three <FooterLink href="https://england.shelter.org.uk/donate">links</FooterLink> look better than two.</p>
        </FooterElem>
      </div>

    </footer >
  )
}

export default Footer

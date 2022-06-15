import Link from "next/link";
import React from "react";

function Header() {
    return (
        <header>
            <div>
                <Link href="/">
                    <img
                        src="https://links.papareact.com/yvf"
                        alt="medium Logo"
                        className="w-44 object-contain cursor-pointer"
                    />
                </Link>
                <div>
                    <h3>About</h3>
                    <h3>Contact</h3>
                    <h3>Follow</h3>
                </div>
            </div>
            <div></div>
        </header>
    );
}

export default Header;

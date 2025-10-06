import React from "react";

function Footer() {
	return (
		<footer className="footer">
			<div className="container-responsive footer-inner">
				<p>© {new Date().getFullYear()} CureQueue. All rights reserved.</p>
				<p>Built with care for patients and providers.</p>
			</div>
		</footer>
	);
}

export default Footer;



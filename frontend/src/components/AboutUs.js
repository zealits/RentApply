import React from "react";
import OwlCarousel from "react-owl-carousel3";
import img1 from "../assets/images/finney/1.png";
import img2 from "../assets/images/finney/2.png";
import img3 from "../assets/images/finney/3.png";
import img4 from "../assets/images/finney/4.png";
import img5 from "../assets/images/finney/5.png";
import img6 from "../assets/images/finney/6.png";
import img7 from "../assets/images/finney/7.png";
import img8 from "../assets/images/finney/8.png";
import img9 from "../assets/images/finney/9.png";
import img10 from "../assets/images/finney/10.png";

import "./AboutUs.css";

const pastWorkImages = [img1, img2, img3, , img4, img5, img6, img7, img8, img9, img10];

const AboutUs = () => {
  const options = {
    loop: true,
    autoplay: true,
    autoplayTimeout: 3000,
    autoplayHoverPause: true,
    margin: 10,
    nav: true,
    dots: false,
    responsive: {
      0: { items: 1 },
      //   600: { items: 2 },
      //   1000: { items: 3 },
    },
  };
  return (
    <section className="about-us-section bg-gray-100 py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* About Us Content */}
          <div>
            <h2 className="text-3xl font-bold mb-6 text-gray-800">About Finney Properties, LLC</h2>
            <p className="text-gray-600 mb-4">
              Finney Properties is dedicated to providing high-quality apartments and houses for rent in Cincinnati, OH.
              We pride ourselves on offering exceptional living spaces that meet the highest standards of comfort and
              style.
            </p>
            <div className="contact-info">
              <h3 className="text-xl font-semibold mb-4">Current Availability</h3>
              <p className="text-gray-600 mb-2">
                Please contact us directly to inquire about our current property listings:
              </p>
              <div className="contact-details">
                <p className="font-medium">📞 Phone: (513) 720-6283</p>
                <p className="font-medium">✉️ Email: finneypropertiesllc@gmail.com</p>
                <p className="font-medium">📬 PO Box 9422, Cincinnati, OH 45209</p>
              </div>
            </div>
          </div>

          {/* Past Work Carousel with Owl Carousel */}
          <div className="past-work-carousel">
            <OwlCarousel {...options}>
              {pastWorkImages.map((image, index) => (
                <div key={index} className="item">
                  <img
                    src={image}
                    alt={`Past work ${index + 1}`}
                    className="w-full h-96 object-cover rounded-lg shadow-lg"
                  />
                </div>
              ))}
            </OwlCarousel>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;

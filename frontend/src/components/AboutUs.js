import React from "react";
import OwlCarousel from "react-owl-carousel3";

import "./AboutUs.css";

const pastWorkImages = [
  "https://cdn.houseplansservices.com/content/driar5vsn9j6vdvam33js5o8bo/w991x660.jpg?v=2",
  "https://www.cincinnati.com/gcdn/presto/2021/05/20/PCIN/3613dfe2-9705-45f2-9e6e-ed064804d3d4-Northside_duplex.jpeg?width=660&height=442&fit=crop&format=pjpg&auto=webp",
  "https://cincinnatirefined.com/resources/media2/16x9/full/1050/center/80/771191f7-3e38-42ae-94c1-62de1d0c8d49-large16x9_9200CunninghamRdExterior3.jpg?1471273131776",
  "https://ssl.cdn-redfin.com/photo/158/islphoto/931/genIslnoResize.1828931_0.jpg",
  "https://images.squarespace-cdn.com/content/v1/5a4ff0f4aeb625d6f843c289/1515985897815-MMCN0Z0LGCFXUXQ77ZSG/_MG_7917.jpg",
];

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
                <p className="font-medium">📞 Phone: (XXX) XXX-XXXX</p>
                <p className="font-medium">✉️ Email: info@finneyproperties.com</p>
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

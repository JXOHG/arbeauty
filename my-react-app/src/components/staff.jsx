import React from 'react';

const Staff = () => {
  const staffMembers = [
    { name: 'Rachel', role: 'Representative, Lead Hairstylist', email: '' },
    { name: 'Ashley', role: 'Manager, hairstylist', email: '' },
    { name: 'Hannah', role: 'Hairstylist', email: '' },
  ];

  return (
    <section id="staff" className="py-20 bg-gray-100">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-center">Our Staff</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {staffMembers.map((member, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center">
              <img 
                src={`/placeholder.svg?height=200&width=200&text=${member.name}`}
                alt={`${member.name}'s portrait`}
                className="w-40 h-40 rounded-full mb-4 object-cover"
              />
              <h3 className="text-xl font-semibold mb-2">{member.name}</h3>
              <p className="text-gray-600 text-center">{member.role}</p>
              {member.email && <p className="text-gray-600 mt-2">{member.email}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Staff;


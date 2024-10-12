import React from 'react';


const CourseCard = ({ course }) => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:scale-105 cursor-pointer">
    <img src={course.image} alt={course.name} className="w-40 h-48 object-cover" />
    <div className="p-4">
      <h3 className="text-xl font-semibold text-purple-700 mb-2">{course.name}</h3>
      <p className="text-gray-600 mb-4">{course.description}</p>
      <div className="flex justify-between items-center text-sm text-gray-500">
        <span>{course.duration}</span>
        <span>{course.language}</span>
      </div>
    </div>
  </div>
);

const LearnSigns = () => {
  const courses = [
    {
      name: "ASL Basics",
      description: "Learn the fundamentals of American Sign Language",
      duration: "4 weeks",
      language: "ASL",
      image: "https://i.pinimg.com/564x/b8/3b/88/b83b887ea77a8bbe4fb2ca15fa80866d.jpg"
    },
    {
      name: "BSL for Beginners",
      description: "Start your journey in British Sign Language",
      duration: "6 weeks",
      language: "BSL",
      image: "https://i.pinimg.com/564x/b8/3b/88/b83b887ea77a8bbe4fb2ca15fa80866d.jpg"
    },
    {
      name: "Fingerspelling Mastery",
      description: "Improve your fingerspelling skills in any sign language",
      duration: "2 weeks",
      language: "Universal",
      image: "https://i.pinimg.com/564x/b8/3b/88/b83b887ea77a8bbe4fb2ca15fa80866d.jpg"
    },
    {
      name: "Sign Language in Education",
      description: "Learn how to incorporate sign language in educational settings",
      duration: "8 weeks",
      language: "Multiple",
      image: "https://i.pinimg.com/564x/b8/3b/88/b83b887ea77a8bbe4fb2ca15fa80866d.jpg"
    },
    {
      name: "Medical Sign Language",
      description: "Essential signs for healthcare professionals",
      duration: "5 weeks",
      language: "ASL/BSL",
      image: "https://i.pinimg.com/564x/b8/3b/88/b83b887ea77a8bbe4fb2ca15fa80866d.jpg"
    },
    {
      name: "Sign Language for Kids",
      description: "Fun and interactive course for children to learn basic signs",
      duration: "4 weeks",
      language: "ASL",
      image: "https://i.pinimg.com/564x/b8/3b/88/b83b887ea77a8bbe4fb2ca15fa80866d.jpg"
      },
      {
        name: "Medical Sign Language",
        description: "Essential signs for healthcare professionals",
        duration: "5 weeks",
        language: "ASL/BSL",
        image: "https://i.pinimg.com/564x/b8/3b/88/b83b887ea77a8bbe4fb2ca15fa80866d.jpg"
      },
      {
        name: "Sign Language for Kids",
        description: "Fun and interactive course for children to learn basic signs",
        duration: "4 weeks",
        language: "ASL",
        image: "https://i.pinimg.com/564x/b8/3b/88/b83b887ea77a8bbe4fb2ca15fa80866d.jpg"
      },
  ];

  return (
    <>
      <div className="flex-1 overflow-auto">
        <div className="p-8 lg:pl-72">
          <h1 className="text-4xl font-bold text-purple-700 mb-8">Learn Signs</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
            {courses.map((course, index) => (
              <CourseCard key={index} course={course} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default LearnSigns;
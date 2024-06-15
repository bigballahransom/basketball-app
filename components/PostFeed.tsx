// import { IPostDocument } from "@/mongodb/models/post";
// import Post from "./Post";

// async function PostFeed({ posts }: { posts: IPostDocument[] }) {
//   return (
//     <div className="space-y-2 pb-20">
//       {posts?.map((post) => (
//         <Post key={post._id as string} post={post} />
//       ))}
//     </div>
//   );
// }

// export default PostFeed;
'use client';

import { useState } from "react";
import { IPostDocument } from "@/mongodb/models/post";
import Post from "./Post";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const initialFilters = {
  sport: "all",
  city: "all",
  neighborhood: "all",
};

function PostFeed({ posts }: { posts: IPostDocument[] }) {
  const [filters, setFilters] = useState(initialFilters);

  const handleFilterChange = (name: string, value: string) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const filteredPosts = posts.filter((post) => {
    const { sport, city, neighborhood } = filters;
    return (
      (sport === "all" || post.sport === sport) &&
      (city === "all" || post.city === city) &&
      (neighborhood === "all" || post.neighborhood === neighborhood)
    );
  });

  return (
    <div>
      <div className="filter-container mb-4 flex space-x-2">
        <Select onValueChange={(value) => handleFilterChange("sport", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select Sport" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Sports</SelectItem>
            <SelectItem value="Basketball">Basketball</SelectItem>
            <SelectItem value="Pickle Ball">Pickle Ball</SelectItem>
            <SelectItem value="Golf">Golf</SelectItem>
            <SelectItem value="Ultimate Frisbee">Ultimate Frisbee</SelectItem>
            {/* Add more sports as needed */}
          </SelectContent>
        </Select>

        <Select onValueChange={(value) => handleFilterChange("city", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select City" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Cities</SelectItem>
            <SelectItem value="Seattle">Seattle</SelectItem>
              <SelectItem value="Bellevue">Bellevue</SelectItem>
              <SelectItem value="Mercer Island">Mercer Island</SelectItem>
            {/* Add more cities as needed */}
          </SelectContent>
        </Select>

        <Select onValueChange={(value) => handleFilterChange("neighborhood", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select Neighborhood" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Neighborhoods</SelectItem>
            <SelectItem value="Cascade Playground">Cascade Playground</SelectItem>
              <SelectItem value="Cal Anderson Park">Cal-Anderson Park</SelectItem>
              <SelectItem value="Greenlake">Greenlake</SelectItem>
              <SelectItem value="Tt Minor Court">T.T. Minor Playground</SelectItem>
              <SelectItem value="Miller Playground">Miller Playground</SelectItem>
            {/* Add more neighborhoods as needed */}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2 pb-20">
        {filteredPosts.map((post) => (
          <Post key={post._id as string} post={post} />
        ))}
      </div>
    </div>
  );
}

export default PostFeed;

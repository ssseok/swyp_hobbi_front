import { useEffect, useState } from 'react';
import Tag from '../common/tag';
import { MyPageInfo } from '@/types/my_page';
import { userApi } from '@/api/user';

interface UserHobbyProps {
  hobbyTags: string[];
}

export default function UserHobby() {
  const [hobbyTags, setHobbyTags] = useState<string[]>([]);

  useEffect(() => {
    const fetchHobbies = async () => {
      try {
        const data: MyPageInfo = await userApi.getMyPageInfo();

        setHobbyTags(data.hobbyTags || []);
      } catch (err) {
        console.error('취미 태그 로딩 실패:', err);
      }
    };

    fetchHobbies();
  }, []);

  return (
    <div>
      <div className="text-xl font-semibold leading-[100%] mb-[23px] max-md:mb-4">
        나의 취미
      </div>

      <div className="flex flex-wrap gap-2 max-md:justify-center">
        {hobbyTags.length > 0 ? (
          hobbyTags.map((tag, index) => (
            <Tag key={index} label={tag} variant="white" />
          ))
        ) : (
          <div className="text-sm text-gray-400">취미 태그가 없습니다.</div>
        )}
      </div>
    </div>
  );
}

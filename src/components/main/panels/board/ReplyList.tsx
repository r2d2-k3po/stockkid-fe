import React, {FC} from 'react';
import {EditorReadOnlyRef, EditorRef, ReplyDTO} from '../BoardPage';
import {useTranslation} from 'react-i18next';
import {useAppDispatch} from '../../../../app/hooks';
import ReplyEditor from './ReplyEditor';

type ReplyListProps = {
  memberId: string | null;
  panelId: string;
  boardId: string;
  replyDTOList: ReplyDTO[] | null | undefined;
  loadBoard: (boardId: string | null, setContent: boolean) => Promise<void>;
  editorRef: React.MutableRefObject<EditorRef | null>;
  editorReadOnlyRef: React.MutableRefObject<EditorReadOnlyRef | null>;
};

const ReplyList: FC<ReplyListProps> = ({
  memberId,
  panelId,
  boardId,
  replyDTOList,
  loadBoard,
  editorRef,
  editorReadOnlyRef
}) => {
  const {t} = useTranslation();
  const dispatch = useAppDispatch();

  return (
    <div>
      <div className="m-2">ReplyList</div>
      <div className="m-2 mt-5 h-48">
        <ReplyEditor
          panelId={panelId}
          editorRef={editorRef}
          loadBoard={loadBoard}
        />
      </div>
    </div>
  );
};

export default React.memo(ReplyList);

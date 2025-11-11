import { PrimaryBtn } from "./primary_btn";
import { Progress } from "./progress";
import { SecondaryBtn } from "./secondary_btn";

export function StepsHeader({ title, progress, nextTitle, onClickNext, onClickPrev, isPrevDisabled, isNextDisabled}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-row justify-between items-center">
        <h1 className="text-xl text-white"> {title} </h1>
        <div className="flex flex-row gap-2">
          <SecondaryBtn title={"Previous"} disabled={isPrevDisabled} onClick={onClickPrev}/>
          <PrimaryBtn title={nextTitle} disabled={isNextDisabled} onClick={onClickNext} />
        </div>
      </div>
      <Progress progress={progress}/>
    </div>
  );
}

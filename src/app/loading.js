import loaderStyle from "./loading.module.css";
export default function Loading() {
  return (
    <div className={loaderStyle.container}>
      <div className={loaderStyle.loading}>
        <div className={loaderStyle.loadingletter}>L</div>
        <div className={loaderStyle.loadingletter}>o</div>
        <div className={loaderStyle.loadingletter}>a</div>
        <div className={loaderStyle.loadingletter}>d</div>
        <div className={loaderStyle.loadingletter}>i</div>
        <div className={loaderStyle.loadingletter}>n</div>
        <div className={loaderStyle.loadingletter}>g</div>
        <div className={loaderStyle.loadingletter}>.</div>
        <div className={loaderStyle.loadingletter}>.</div>
        <div className={loaderStyle.loadingletter}>.</div>
      </div>
    </div>
  );
}

import { Navigate, Route, useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate()
  return (
    <div>

      <div className="px-6 py-24 flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex flex-col gap-5">
          <h1 className="font-normal text-5xl">
            Wellcome, <span className="font-semibold ">Stranger!</span>
          </h1>
          <div>
            <span></span>
            <span className="font-normal text-4xl">Good Morning</span>
          </div>
          <div>
            <div className="mt-10 mb-5 text-lg">Status</div>
            <div>
              <div className="flex my-4 gap-2">
                <span className="text-xl font-semibold ">Verification: </span>{" "}
                <span className="text-xl">Pending</span>
              </div>
              <div className="flex my-4 gap-2">
                <span className="text-xl font-semibold">Stukey Score:</span>
                <span className="text-xl">0</span>
              </div>
            </div>
            <div className="button my-8">
              <button className=" px-9 py-2 bg-[#2B2928] text-white rounded-full cursor-pointer"
              onClick={() => {
                // window.location.href = "/mint";
                navigate("/mint")
              }}>
                Verify
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="px-6 py-24 flex justify-between items-center max-w-7xl mx-auto h-[40rem]">
        <div className="">
          <h1 className="font-semibold text-5xl my-12">You're StuKey</h1>
          <div className="font-normal text-2xl my-12 w-96">
            A Smarter Way to Prove You're a Student.
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;

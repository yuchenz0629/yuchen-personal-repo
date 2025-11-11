import { PencilSquareIcon } from "@heroicons/react/24/outline";

export function Table({ title, headers, rowData }) {
  return (
    <div className="rounded-sm border px-5 pt-6 text-white pb-2.5 shadow-default border-strokedark bg-boxdark sm:px-7.5 xl:pb-1">
      <h4 className="mb-6 text-xl font-semibold text-white">{title}</h4>

      <div className="overflow-x-auto">
        <div className={`flex justify-evenly rounded-sm bg-meta-4`}>
          {headers.map((header, index) => (
            <div
              className={`${"text-center"} p-2.5 xl:p-5`}
              key={header.key}
            >
              <h5 className="text-sm font-medium uppercase xsm:text-base">{header.name}</h5>
            </div>
          ))}
        </div>

        {rowData.map((row, key) => (
          <div
            className={`flex justify-evenly ${
              key === rowData.length - 1 ? "" : "border-b border-strokedark"
            }`}
            key={key}
          >
            {headers.map((header) => {
              const value = row[header.key];
              const type = header.type;
              if (type === "actions") {
                return (
                  <div className="flex flex-row justify-center items-center">
                    {header.actions.map((action) => (
                      <div>
                        <div onClick={() => action.onClick(row["id"])}>
                          {" "}
                          <PencilSquareIcon className="cursor-pointer size-5" />{" "}
                        </div>
                      </div>
                    ))}
                  </div>
                );
              }
              return (
                <div
                  className={`flex  items-center justify-center p-2.5 xl:p-5`}
                  key={header.key}
                >
                  {header.isImage ? (
                    <img src={value} alt={header.name} className="flex-shrink-0" />
                  ) : (
                    <p className={`text-white ${header.customClass || ""}`}>{value}</p>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

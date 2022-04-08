export default function RoomGallery({ products, onSelectProduct, isBooking }) {
  const handleSelect = (product) => {
    onSelectProduct(product);
  };

  return (
    <div className="bg-white">
      <div className="max-w-2xl mx-auto py-2">
        <div className="mt-6 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-2 xl:gap-x-8">
          {products.map((product) => (
            <div
              key={product.id}
              className="group relative pointer-events: auto;"
              onClick={() => handleSelect(product)}
            >
              <div className="w-full min-h-80 bg-gray-200 aspect-w-1 aspect-h-1 rounded-md overflow-hidden group-hover:opacity-75 lg:h-50 lg:aspect-none">
                <img
                  src={isBooking ? product?.room?.image : product.image}
                  className="w-full h-full object-center object-cover lg:w-full lg:h-full"
                />
              </div>
              <div className="mt-4 flex justify-between">
                <div>
                  <h3 className="text-sm text-gray-700">
                    <a href={product.href}>
                      <span aria-hidden="true" className="absolute inset-0" />
                      {isBooking ? product?.room?.name : product.name}
                    </a>
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {" "}
                    {!isBooking && product.type}
                  </p>
                  {isBooking && (
                    <div>
                      <p className="mt-1 text-xs text-gray-500">
                        Start: {product.startTime.substring(11, 13)}{" "}
                        {parseInt(product.startTime.substring(11, 13)) >= 12
                          ? "PM"
                          : "AM"}
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        End: {product.endTime.substring(11, 13)}{" "}
                        {parseInt(product.startTime.substring(11, 13)) >= 12
                          ? "PM"
                          : "AM"}
                      </p>
                    </div>
                  )}
                </div>
                {!isBooking && (
                  <p
                    className={`text-sm font-medium ${
                      product.status === "Available"
                        ? "text-green-900"
                        : "text-grey-900"
                    }`}
                  >
                    {product.status}
                  </p>
                )}

                {isBooking && (
                  <p
                    className={`text-sm font-medium ${
                      product.status === "Booked"
                        ? "text-green-900"
                        : "text-grey-900"
                    }`}
                  >
                    {product.status}
                  </p>
                )}
                {isBooking && product.status === "Booked" && (
                  <div className="text-gray-500 hover:bg-gray-700 underline hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                    Cancel
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

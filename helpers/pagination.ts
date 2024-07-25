interface objectPagination {
  currentPage: number;
  limitItems: number;
  skip?: number;
  totalPage?: number;
}

const paginationHelper = (
  objectPagination: objectPagination,
  query: Record<string, any>,
  countRecords: number
) => {
  // nếu có tham số page ở trên route
  if (query.page) {
    objectPagination.currentPage = parseInt(query.page); // chuyển sang số
  }
  // tìm vị trí sản phẩm bắt đầu trong trang đấy
  if (query.limit) {
    objectPagination.limitItems = parseInt(query.limit); // chuyển sang số
  }
  objectPagination.skip =
    (objectPagination.currentPage - 1) * objectPagination.limitItems;
  // truy vấn trong db nên cần dùng await
  const totalPage = Math.ceil(countRecords / objectPagination.limitItems);
  objectPagination.totalPage = totalPage;
  return objectPagination;
};
export default paginationHelper;

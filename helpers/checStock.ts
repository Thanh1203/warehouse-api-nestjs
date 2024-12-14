import { PrismaService } from '@/src/prisma/prisma.service';

const prismaService = new PrismaService();

export const checkStock = async (companyId: number, ids: number[]): Promise<{ [key: number]: boolean }> => {
  const results = await prismaService.products.findMany({
    where: {
      CompanyId: companyId,
      ClassifyId: { in: ids },
      inventory_items: { some: { Quantity: { gt: 0 } } },
    },
    select: {
      ClassifyId: true
    }
  });

  const stockMap = ids.reduce((acc, id) => {
    acc[id] = false;
    return acc;
  }, {} as { [key: number]: boolean });

  results.forEach(result => {
    stockMap[result.ClassifyId] = true;
  });

  return stockMap;
}
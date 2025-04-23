import prisma from '@/libs/prismadb';

type ReportRouteParams = {
  report: string;
};

export async function GET(request: Request, { params }: { params: ReportRouteParams }) {
  const { report } = params;

  // if report is nan, find by slug
  if (isNaN(parseInt(report))) {
    const reports = await prisma.report.findUnique({
      where: {
        slug: report,
      },
      include: {
        user: true,
      },
    });

    return Response.json(reports);
  }

  const reports = await prisma.report.findMany({
    where: {
      id: parseInt(report),
    },
    include: {
      user: true,
    },
  });

  return Response.json(reports);
}

export async function DELETE(request: Request, { params }: { params: ReportRouteParams }) {
  const { report } = params;

  let where = {};

  if (isNaN(parseInt(report))) {
    where = {
      slug: report,
    };
  } else {
    where = {
      id: parseInt(report),
    };
  }

  const reports = await prisma.report.delete({
    where: where as any,
  });

  return Response.json(reports);
}

export async function PUT(request: Request, { params }: { params: ReportRouteParams }) {
  const { report } = params;

  const body = await request.formData();

  const title = body.get('title') as string;
  const description = body.get('description') as string;

  let where = {};

  if (isNaN(parseInt(report))) {
    where = {
      slug: report,
    };
  } else {
    where = {
      id: parseInt(report),
    };
  }

  const reports = await prisma.report.update({
    where: where as any,
    data: {
      title: title,
      description: description,
    },
  });

  return Response.json(reports);
}
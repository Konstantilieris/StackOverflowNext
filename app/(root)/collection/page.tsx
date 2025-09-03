import LocalSearch from "@/components/shared/search/LocalSearch";
import Filter from "@/components/shared/Filter";
import { QuestionFilters } from "@/constants/filters";
import QuestionCard from "@/components/cards/QuestionCard";
import NoResult from "@/components/shared/NoResult";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { getSavedQuestion } from "@/lib/actions/user.action";
import { SearchParamsProps } from "@/types";
import Pagination from "@/components/Pagination";

export default async function Home({ searchParams }: SearchParamsProps) {
  const { userId: clerkId } = auth();
  if (!clerkId) redirect("/sign-in");
  const result = await getSavedQuestion({
    clerkId,
    searchQuery: searchParams.q,
    filter: searchParams.filter,
    page: searchParams?.page ? +searchParams.page : 1,
  });
  return (
    <>
      <h1 className="h1-bold text-dark100_light900">Saved Question</h1>

      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearch
          route="/collection"
          iconPosition="left"
          imgSrc="/assets/icons/search.svg"
          placeholder="Search for questions"
          otherClasses="flex-1"
        />
        <Filter
          filters={QuestionFilters}
          otherClasses="min-h-[56px] sm:min-w-[170px]"
        />
      </div>
      <div className="mt-10 flex w-full flex-col gap-6">
        {result?.questions?.length! > 0 ? (
          result?.questions.map((question: any) => {
            return (
              <QuestionCard
                key={question._id}
                _id={question._id}
                title={question.title}
                tags={question.tags}
                author={question.author}
                upvotes={question.upvotes.length}
                views={question.views}
                answers={question.answers}
                createdAt={question.createdAt}
              />
            );
          })
        ) : (
          <NoResult
            title={"There is no saved questions to show"}
            description="Be the first to break the silence! 🚀 Ask a Question and kickstart the
       discussion. our query could be the next big thing others learn from. Get
       involved! 💡"
            link="/ask-question"
            linkTitle="Ask a question"
          />
        )}
      </div>
      <div className="mt-10">
        <Pagination
          pageNumber={searchParams?.page ? +searchParams.page : 1}
          isNext={result.isNext}
        />
      </div>
    </>
  );
}

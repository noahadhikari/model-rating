import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Text,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import { trpc } from "../../utils/trpc";

interface CreateRatingProps {
  modelId: number;
  modelName: string;
}

const CreateRating = (props: CreateRatingProps) => {
  const [ratingScore, setRatingScore] = useState<number>(0);
  const [reasoning, setReasoning] = useState<string>("");
  const createRatingMutation = trpc.rating.createRating.useMutation();
  const toast = useToast();

  const modelId = props.modelId;
  const handleSubmit = () => {
    createRatingMutation
      .mutateAsync({
        modelId: modelId,
        score: ratingScore,
        reasoning: reasoning,
      })
      .then(() => {
		setRatingScore(0);
		setReasoning("");
        toast({
          title: "Rating created",
          description: "Your rating has been created",
          status: "success",
          duration: 2000,
          isClosable: true,
          position: "top-right",
        });
      })
      .catch((err) => {
        toast({
          title: "Error",
          description: err.message,
          status: "error",
          duration: 4000,
          isClosable: true,
          position: "top-right",
        });
      });
  };

  return (
    <Flex flexDir="column" h="100%">
      <Text fontWeight="semibold" fontSize="2xl">
        Rate model {props.modelId}
      </Text>
      <FormControl color="black" isRequired mt={1}>
        <FormLabel>Score</FormLabel>
        <NumberInput
          outline="1px solid black"
          focusBorderColor="transparent"
          max={2}
          min={-2}
		  value={ratingScore}
          onChange={(val) => setRatingScore(parseInt(val))}
        >
          <NumberInputField color="black" />
          <NumberInputStepper color="black">
            <NumberIncrementStepper color="black" />
            <NumberDecrementStepper color="black" />
          </NumberInputStepper>
        </NumberInput>
      </FormControl>

      <FormControl color="black" mt={2}>
        <FormLabel>Reasoning</FormLabel>
        <Textarea
          color="black"
          focusBorderColor="transparent"
          maxLength={500}
          outline="1px solid black"
		  value={reasoning}
          onChange={(e) => setReasoning(e.target.value)}
        />
      </FormControl>
      <Button w="100%" colorScheme="green" mt={2} onClick={handleSubmit}>
        Submit
      </Button>
    </Flex>
  );
};

export default CreateRating;

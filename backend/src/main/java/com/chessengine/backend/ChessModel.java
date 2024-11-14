package com.chessengine.backend;

import java.io.File;
import java.io.IOException;
import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import org.tensorflow.Graph;
import org.tensorflow.GraphOperation;
import org.tensorflow.Operation;
import org.tensorflow.SavedModelBundle;
import org.springframework.stereotype.Component;
import org.springframework.core.io.ClassPathResource;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.tensorflow.SavedModelBundle;
import org.tensorflow.Session;
import org.tensorflow.Tensor;
import org.tensorflow.ndarray.Shape;
import org.tensorflow.types.TFloat32;

@Component
public class ChessModel implements AutoCloseable {
    private final SavedModelBundle model;

    public ChessModel(ResourceLoader resourceLoader) throws IOException {
        try {
            Resource modelResource = resourceLoader.getResource("classpath:models/saved_model.pb");
            String modelPath = modelResource.getFile().getParentFile().getAbsolutePath();
            this.model = SavedModelBundle.load(modelPath, "serve");

            // Access the graph
        } catch (Exception e) {
            throw new RuntimeException("Failed to load the model in ChessModel " + e.toString());
        }
    }

    public List<String> predict(ChessBoard chessBoard) {
        // Create a tensor
        TFloat32 inputTensor = chessBoard.encodeBoardToTensor();

        System.out.println("Tensor created, inputting to NN");
        // Feed the tensor to the model
        Map<String, Tensor> inputs = new HashMap<>();
        inputs.put("input_layer", inputTensor);
        Tensor output = this.model.call(inputs).get(0);
        System.out.println("Done");

        // Make predictions using the model
        float[] predictions = new float[4672];
        output.asRawTensor().data().asFloats().read(predictions);

        int[] top5Predictions = getTopKIndices(predictions, 5);
        List<String> possibleMoves = new ArrayList<>();
        List<String> currentLegalMoves = chessBoard.getLegalMoves();

        for (int pred : top5Predictions) {
            int[] move = chessBoard.decodeMove(pred);
            String moveFen = chessBoard.getMoveFen(move[0], move[1]);
            System.out.println(moveFen);
            if(currentLegalMoves.contains(moveFen))
            {
                possibleMoves.add(moveFen);
            }

            // TODO:: We have to code chess board logic
            // So we can first get the legal moves of the current boardState
            // Then we can decode the predicted move (as int) to chess coordinates
            // Then convert the chess coordinates to chess Move (FEN NOTATION?)
            // then check if the move is in the legal moves, if so, append

            // It is good to code the chess in backend, so we can validate moves
            // We can also render the html serverside if the move is valid!
        }

        return possibleMoves;
    }

    @Override
    public void close() throws Exception {
        if (model != null) {
            model.close();
        }
    }

    // Helper functions and classes
    private static int[] getTopKIndices(float[] arr, int k) {
        IdxValPair[] pairs = new IdxValPair[arr.length];
        for (int i = 0; i < arr.length; i++) {
            pairs[i] = new IdxValPair(i, arr[i]);
        }

        Arrays.sort(pairs, (a, b) -> Float.compare(b.value, a.value));

        int[] result = new int[Math.min(k, arr.length)];
        for (int i = 0; i < result.length; i++) {
            result[i] = pairs[i].index;
        }

        return result;
    }

    private static class IdxValPair {
        int index;
        float value;

        IdxValPair(int index, float value) {
            this.index = index;
            this.value = value;
        }
    }

}
